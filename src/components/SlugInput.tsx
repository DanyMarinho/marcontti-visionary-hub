import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

export default function SlugInput({ control, watch, setValue }) {
  const companyName = watch('companyName');
  const slug = watch('slug');
  const debouncedName = useDebounce(companyName, 300);

  // Auto‑generate slug when name changes
  useEffect(() => {
    if (!debouncedName) return;
    const generated = debouncedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setValue('slug', generated);
  }, [debouncedName, setValue]);

  // Verify uniqueness (simple call; actual RPC could be used)
  const checkUnique = async (value) => {
    const { data, error } = await supabase
      .from('tenants')
      .select('id', { count: 'exact', head: true })
      .eq('slug', value);
    return !error && data?.length === 0;
  };

  return (
    <Controller
      name="slug"
      control={control}
      rules={{
        required: 'Slug é obrigatório',
        validate: async (v) => (await checkUnique(v)) || 'Slug já está em uso',
      }}
      render={({ field, fieldState }) => (
        <div className="mt-2">
          <Input {...field} placeholder="Slug (identificador único)" />
          {fieldState.error && (
            <p className="text-xs text-red-400 mt-1">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
