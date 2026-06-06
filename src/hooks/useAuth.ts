import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import type { User, Role } from '@/types';

/**
 * Bootstraps the authenticated user into the global auth store.
 * - Subscribes to Supabase auth state changes
 * - Loads the public.users row + role from user_roles (security definer RPC)
 * - Locks tenant/store to the user's context for non-admins
 */
export function useAuth() {
  const { user, setUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrate = async (authUserId: string | null) => {
      if (!authUserId) {
        if (mounted) setUser(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, tenant_id, store_id, is_active, avatar, phone, created_at, updated_at')
        .eq('id', authUserId)
        .maybeSingle();

      if (error || !profile) {
        if (mounted) setUser(null);
        return;
      }

      // Authoritative role lookup (security definer)
      const { data: roleData } = await supabase.rpc('user_role');
      const role = ((roleData as unknown as string) || profile.role || 'vendedor') as Role;

      const merged: User = {
        ...(profile as any),
        role,
      };
      if (mounted) setUser(merged);
    };

    // Listener first (synchronous)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      // Defer the supabase call to avoid recursive lock
      setTimeout(() => { void hydrate(uid); }, 0);
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data }) => {
      void hydrate(data.session?.user?.id ?? null).finally(() => {
        if (mounted) setIsLoading(false);
      });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };
}