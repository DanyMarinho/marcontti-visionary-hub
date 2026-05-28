import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Calendar, DollarSign, History, ArrowRight, UserPlus, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

interface CardDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: any;
}

export function CardDetail({ open, onOpenChange, card }: CardDetailProps) {
  const { user } = useAuthStore();
  const canTransfer = user?.role === 'admin' || user?.role === 'loja';

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-[#1f1f1f] bg-[#0d0d0d]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Badge variant="outline" className="text-[9px] uppercase bg-orange-500/5 text-orange-600 border-orange-500/20">
                Card #{card.id.substring(0, 8)}
              </Badge>
              <DialogTitle className="text-xl font-bold text-white">{card.title || card.client?.full_name}</DialogTitle>
              <p className="text-sm text-[#888888] flex items-center gap-2">
                <User size={14} /> {card.client?.full_name}
              </p>
            </div>
            <div className="flex gap-2">
               {canTransfer && (
                 <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold border-[#1f1f1f]">
                   <UserPlus size={14} className="mr-1" /> Transferir
                 </Button>
               )}
               <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold border-[#1f1f1f] text-red-500 hover:text-red-600">
                 <Archive size={14} className="mr-1" /> Perda
               </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-2 p-6 border-r border-[#1f1f1f] space-y-6 overflow-y-auto">
             <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase text-[#888888] tracking-widest flex items-center gap-2">
                 <History size={14} /> Histórico de Movimentações
               </h3>
               <div className="space-y-4">
                 {[1].map((_, i) => (
                   <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[1px] before:bg-[#1f1f1f]">
                     <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-orange-500" />
                     <div className="space-y-1">
                       <div className="flex items-center gap-2 text-xs">
                         <span className="font-bold text-white">Prospecção</span>
                         <ArrowRight size={12} className="text-[#888888]" />
                         <span className="font-bold text-orange-500">Qualificação</span>
                       </div>
                       <p className="text-[10px] text-[#888888]">
                         Movido por <span className="text-zinc-300">Vendedor</span> em {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          <div className="p-6 bg-[#0d0d0d] space-y-6">
            <div className="space-y-1">
              <Label className="text-[9px] uppercase font-black text-[#888888]">Valor Estimado</Label>
              <div className="text-lg font-black text-white flex items-center gap-1">
                <span className="text-orange-500 text-xs">R$</span>
                {Number(card.estimated_value).toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[9px] uppercase font-black text-[#888888]">Data Prevista</Label>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar size={14} className="text-orange-500" />
                {card.expected_close_date ? format(new Date(card.expected_close_date), 'dd/MM/yyyy') : 'Não definida'}
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-[#1f1f1f]">
               <Label className="text-[9px] uppercase font-black text-[#888888]">Responsável</Label>
               <div className="flex items-center gap-2 pt-1">
                 <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-bold border border-orange-500/20">
                   {card.vendedor?.full_name?.substring(0,1) || 'V'}
                 </div>
                 <span className="text-xs font-bold text-white">{card.vendedor?.full_name || 'Sem responsável'}</span>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
