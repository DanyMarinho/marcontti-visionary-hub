import React, { useState, useMemo } from 'react';
import { useClientes } from './hooks/useClientes';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  User, 
  MoreVertical, 
  MessageSquare,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClienteForm } from './ClienteForm';
import { ClienteDetails } from './components/ClienteDetails';
import { ExportButton } from '@/components/shared/ExportButton';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';

const statusMap: any = {
  active: { label: 'Ativo', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  lead: { label: 'Lead', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  inactive: { label: 'Inativo', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
  lead_unidentified: { label: 'Lead Não Identificado', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
};

import { useDebounce } from '@/hooks/useDebounce';

export default function ClienteList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<any>({ status: 'all' });

  const debouncedSearch = useDebounce(search, 300);
  const { clientes, totalCount, isLoading, deleteCliente } = useClientes(
    page, 
    10, 
    debouncedSearch, 
    filters.status === 'all' ? {} : { status: filters.status }
  );

  const filteredClientes = useMemo(() => clientes, [clientes]);

  const columns = [
    {
      header: 'Cliente',
      cell: (cliente: any) => (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSelectedCliente(cliente); setIsDetailsOpen(true); }}>
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold text-xs group-hover:bg-orange-500 group-hover:text-white transition-colors">
            {cliente.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm group-hover:text-orange-500 transition-colors">{cliente.full_name}</span>
            <span className="text-[10px] text-muted-foreground uppercase">{cliente.phone}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contato',
      cell: (cliente: any) => (
        <div className="flex flex-col">
          <span className="text-xs">{cliente.email || '-'}</span>
          <span className="text-[10px] text-muted-foreground">{cliente.address ? 'Endereço cadastrado' : 'Sem endereço'}</span>
        </div>
      )
    },
    {
      header: 'Última Interação',
      cell: (cliente: any) => (
        <span className="text-xs text-muted-foreground">
          {cliente.last_interaction ? new Date(cliente.last_interaction).toLocaleDateString('pt-BR') : 'Nunca'}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (cliente: any) => (
        <Badge className={cn("font-semibold border", statusMap[cliente.status]?.color || statusMap.active.color)}>
          {statusMap[cliente.status]?.label || 'Ativo'}
        </Badge>
      )
    },
    {
      header: 'Ações',
      className: 'text-right',
      cell: (cliente: any) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSelectedCliente(cliente); setIsFormOpen(true); }}>
                Editar Cliente
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500" 
                onClick={() => {
                  if (confirm(`Deseja realmente excluir o cliente ${cliente.full_name}?`)) {
                    deleteCliente.mutate(cliente.id);
                  }
                }}
              >
                Excluir (Soft-delete)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Base de Clientes</h1>
          <p className="text-muted-foreground text-sm">Gerencie leads e clientes da sua operação.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <ExportButton data={clientes} filename="clientes_crm" />
          <Button onClick={() => { setSelectedCliente(null); setIsFormOpen(true); }} className="bg-orange-500 hover:bg-orange-600 text-white flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Buscar por nome, telefone, e-mail ou tag..." 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.status} onValueChange={(val: string) => setFilters({ ...filters, status: val })}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="lead_unidentified">Lead Não Ident.</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={clientes}
        isLoading={isLoading}
        totalCount={totalCount}
        page={page}
        onPageChange={setPage}
        emptyState={
          <EmptyState 
            icon={User}
            title="Nenhum cliente cadastrado"
            description="Adicione o primeiro cliente para começar a gerenciar sua base e oportunidades."
            action={
              <Button onClick={() => setIsFormOpen(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Primeiro Cliente
              </Button>
            }
          />
        }
      />

      <ClienteForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        cliente={selectedCliente} 
      />

      <ClienteDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        cliente={selectedCliente}
      />
    </div>
  );
}
