import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtime(tenantId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tenantId) return;

    const channel = supabase
      .channel(`tenant-${tenantId}-messages`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          console.log('Realtime message update:', payload);
          // Invalidate queries to refresh the UI
          queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', tenantId] });
          queryClient.invalidateQueries({ queryKey: ['whatsapp-conversations', tenantId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, queryClient]);
}
