import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Settings2, 
  Globe, 
  Clock, 
  Save, 
  Loader2, 
  Info,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DAYS = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export function AgenteIAConfig() {
  const { activeTenantId } = useTenant();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['agent-ia-config', activeTenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_ia_configs')
        .select('*')
        .eq('tenant_id', activeTenantId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedConfig: any) => {
      const { error } = await supabase
        .from('agent_ia_configs')
        .upsert([{
          ...updatedConfig,
          tenant_id: activeTenantId,
          updated_at: new Date().toISOString()
        }], { onConflict: 'tenant_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-ia-config', activeTenantId] });
      toast.success('Configurações do Agente IA salvas com sucesso');
    },
    onError: () => toast.error('Erro ao salvar configurações')
  });

  const [localConfig, setLocalConfig] = useState<any>(null);

  React.useEffect(() => {
    if (config) {
      setLocalConfig(config);
    } else {
      setLocalConfig({
        is_active: false,
        webhook_url: '',
        schedule: DAYS.reduce((acc, day) => ({
          ...acc,
          [day.key]: { enabled: true, start: '08:00', end: '18:00' }
        }), {})
      });
    }
  }, [config]);

  const handleToggleActive = (val: boolean) => {
    setLocalConfig({ ...localConfig, is_active: val });
  };

  const handleToggleDay = (day: string, val: boolean) => {
    setLocalConfig({
      ...localConfig,
      schedule: {
        ...localConfig.schedule,
        [day]: { ...localConfig.schedule[day], enabled: val }
      }
    });
  };

  const handleTimeChange = (day: string, type: 'start' | 'end', val: string) => {
    setLocalConfig({
      ...localConfig,
      schedule: {
        ...localConfig.schedule,
        [day]: { ...localConfig.schedule[day], [type]: val }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(localConfig);
  };

  if (isLoading || !localConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Configurações do Agente IA</h1>
          <p className="text-muted-foreground text-sm">Controle como o robô interage com seus leads no WhatsApp.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 px-4 rounded-full">
          <Bot size={20} className={localConfig.is_active ? "text-orange-500" : "text-zinc-500"} />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {localConfig.is_active ? 'Ativado' : 'Desativado'}
            </span>
            <Switch checked={localConfig.is_active} onCheckedChange={handleToggleActive} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#0a0a0a] border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-white">
              <Globe size={16} className="text-orange-500" /> Integração n8n / Webhook
            </CardTitle>
            <CardDescription>URL do webhook para onde as mensagens serão enviadas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook_url" className="text-zinc-400">URL do Webhook</Label>
              <Input 
                id="webhook_url" 
                value={localConfig.webhook_url || ''} 
                onChange={(e) => setLocalConfig({...localConfig, webhook_url: e.target.value})}
                placeholder="https://n8n.seu-dominio.com/webhook/..." 
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex gap-3">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-400">
                O MEC Hub enviará cada mensagem recebida para este URL. Seu fluxo no n8n deve processar a mensagem e devolver a resposta via API do MEC Hub.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0a] border-zinc-800 row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-white">
              <Clock size={16} className="text-orange-500" /> Horário de Funcionamento
            </CardTitle>
            <CardDescription>O agente responderá apenas nos períodos configurados abaixo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS.map((day) => {
              const dayConfig = localConfig.schedule[day.key] || { enabled: false };
              return (
                <div key={day.key} className="flex items-center justify-between group py-1">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={dayConfig.enabled} 
                      onCheckedChange={(val) => handleToggleDay(day.key, val)}
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      dayConfig.enabled ? "text-white" : "text-zinc-500"
                    )}>
                      {day.label}
                    </span>
                  </div>
                  {dayConfig.enabled && (
                    <div className="flex items-center gap-2">
                      <Input 
                        type="time" 
                        value={dayConfig.start} 
                        onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                        className="h-8 w-24 bg-zinc-900 border-zinc-800 text-xs text-white" 
                      />
                      <span className="text-zinc-500">-</span>
                      <Input 
                        type="time" 
                        value={dayConfig.end} 
                        onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                        className="h-8 w-24 bg-zinc-900 border-zinc-800 text-xs text-white" 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 gap-2 px-8" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Salvar Configurações
        </Button>
      </div>
    </form>
  );
}
