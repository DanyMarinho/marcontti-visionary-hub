import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Loader2, 
  Terminal, 
  CheckCircle2, 
  XCircle,
  FileText
} from 'lucide-react';
import { ExportButton } from '@/components/shared/ExportButton';
import { EmptyState } from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AgenteIALogs() {
  const { activeTenantId } = useTenant();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['agent-ia-logs', activeTenantId, page, search],
    queryFn: async () => {
      let query = supabase
        .from('agent_ia_logs')
        .select('*, client:clients(full_name)', { count: 'exact' })
        .eq('tenant_id', activeTenantId!)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`received_message.ilike.%${search}%,action_taken.ilike.%${search}%`);
      }

      const pageSize = 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      return { data, count };
    },
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const columns = [
    {
      header: 'Data/Hora',
      cell: (log: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium">
            {format(new Date(log.created_at), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">
            {format(new Date(log.created_at), 'HH:mm:ss')}
          </span>
        </div>
      )
    },
    {
      header: 'Lead',
      cell: (log: any) => (
        <span className="text-xs font-semibold">{log.client?.full_name || 'Desconhecido'}</span>
      )
    },
    {
      header: 'Mensagem Recebida',
      cell: (log: any) => (
        <p className="text-xs text-muted-foreground max-w-xs truncate italic">"{log.received_message}"</p>
      )
    },
    {
      header: 'Ação do Agente',
      cell: (log: any) => (
        <div className="flex items-center gap-1.5">
          <Terminal size={12} className="text-orange-500" />
          <span className="text-xs">{log.action_taken || 'Análise de contexto'}</span>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (log: any) => (
        <Badge className={cn(
          "font-bold uppercase text-[9px] tracking-widest",
          log.status === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
        )}>
          {log.status === 'success' ? (
            <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Sucesso</span>
          ) : (
            <span className="flex items-center gap-1"><XCircle size={10} /> Falha</span>
          )}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logs de Execução</h1>
          <p className="text-muted-foreground text-sm">Histórico de ações tomadas pelo Agente IA.</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={data?.data || []} filename="logs_agente_ia" />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar nos logs..." 
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-zinc-800">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <DataTable 
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        totalCount={data?.count || 0}
        page={page}
        onPageChange={setPage}
        emptyState={
          <EmptyState 
            icon={FileText}
            title="Nenhum log registrado ainda"
            description="As ações do Agente IA aparecerão aqui assim que as conversas começarem a ser processadas."
          />
        }
      />
    </div>
  );
}
