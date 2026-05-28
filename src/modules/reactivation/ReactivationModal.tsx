import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare, Calendar, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReactivationModalProps {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReactivationModal({ cardId, isOpen, onClose }: ReactivationModalProps) {
  const { activeTenantId, activeTenant } = useTenant();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [transferUserId, setTransferUserId] = useState('');

  const { data: card } = useQuery({
    queryKey: ['card', cardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pipeline_cards')
        .select('*, client:clients(*)')
        .eq('id', cardId)
        .single();
      if (error) throw error;
      
      // Set default message based on stage
      const templates = activeTenant?.reactivation_messages || {};
      const stageKey = data.stage_key;
      const template = templates[stageKey] || "Olá {nome}! Tudo bem?";
      setMessage(template.replace('{nome}', data.client?.full_name?.split(' ')[0] || ''));
      
      return data;
    },
    enabled: isOpen && !!cardId
  });

  const { data: sellers = [] } = useQuery({
    queryKey: ['sellers', activeTenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('tenant_id', activeTenantId!)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: isOpen
  });

  const logMutation = useMutation({
    mutationFn: async (log: any) => {
      const { error } = await supabase.from('reactivation_logs').insert([{
        ...log,
        tenant_id: activeTenantId,
        client_id: card?.client_id,
        user_id: user?.id,
        stage_at_time: card?.stage_key
      }]);
      if (error) throw error;
      
      // Also update the card's updated_at to reset idle timer
      await supabase.from('pipeline_cards').update({ updated_at: new Date().toISOString() }).eq('id', cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactivation-cards'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-cards'] });
      toast.success('Ação de reativação registrada!');
      onClose();
    }
  });

  const handleWhatsApp = () => {
    // In a real app, this would send via WhatsApp API
    logMutation.mutate({ type: 'whatsapp', result: 'Mensagem enviada', notes: message });
  };

  const handleFollowUp = () => {
    logMutation.mutate({ type: 'follow_up', result: 'Lembrete agendado', notes: `Agendado para: ${followUpDate}` });
  };

  const handleTransfer = () => {
    const seller = sellers.find(s => s.id === transferUserId);
    logMutation.mutate({ type: 'transfer', result: 'Card transferido', notes: `Transferido para: ${seller?.full_name}` });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d0d0d] border-[#1f1f1f] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reativar Cliente: {card?.client?.full_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="whatsapp" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-[#1a1a1a]">
            <TabsTrigger value="whatsapp" className="gap-2"><MessageSquare size={14} /> WhatsApp</TabsTrigger>
            <TabsTrigger value="followup" className="gap-2"><Calendar size={14} /> Follow-up</TabsTrigger>
            <TabsTrigger value="transfer" className="gap-2"><Share2 size={14} /> Transferir</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mensagem Sugerida</Label>
              <Textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                className="bg-[#1a1a1a] border-[#1f1f1f] h-32"
              />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 gap-2" onClick={handleWhatsApp}>
              Enviar pelo WhatsApp
            </Button>
          </TabsContent>

          <TabsContent value="followup" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Data e Hora do Lembrete</Label>
              <Input 
                type="datetime-local" 
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="bg-[#1a1a1a] border-[#1f1f1f]" 
              />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 gap-2" onClick={handleFollowUp} disabled={!followUpDate}>
              Agendar Lembrete
            </Button>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vendedor Destino</Label>
              <Select value={transferUserId} onValueChange={setTransferUserId}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#1f1f1f]">
                  <SelectValue placeholder="Selecione um vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {sellers
                    .filter(s => s.id !== user?.id)
                    .map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 gap-2" onClick={handleTransfer} disabled={!transferUserId}>
              Transferir Card
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
