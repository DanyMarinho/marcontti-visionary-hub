import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Search } from 'lucide-react';
import { usePipeline } from '../hooks/usePipeline';
import { useClientes } from '@/modules/crm/hooks/useClientes';
import { useTenant } from '@/hooks/useTenant';

interface CardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: any;
}

const MEC_STAGES = [
  { key: 'prospeccao', label: '1. Prospecção' },
  { key: 'qualificacao', label: '2. Qualificação' },
  { key: 'apresentacao', label: '3. Apresentação' },
  { key: 'proposta', label: '4. Proposta' },
  { key: 'negociacao', label: '5. Negociação' },
  { key: 'fechamento', label: '6. Fechamento' },
  { key: 'pos_venda', label: '7. Pós-venda' },
];

export function CardForm({ open, onOpenChange, card }: CardFormProps) {
  const { createCard } = usePipeline();
  const { clientes } = useClientes(1, 100); // Get clients for selection
  const { activeTenantId } = useTenant();
  
  const [formData, setFormData] = useState({
    title: '',
    client_id: '',
    estimated_value: '',
    stage_key: 'prospeccao',
    vendedor_id: ''
  });

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        client_id: card.client_id || '',
        estimated_value: card.estimated_value?.toString() || '',
        stage_key: card.stage_key || 'prospeccao',
        vendedor_id: card.vendedor_id || ''
      });
    } else {
      setFormData({
        title: '',
        client_id: '',
        estimated_value: '',
        stage_key: 'prospeccao',
        vendedor_id: ''
      });
    }
  }, [card, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.title) return;
    
    createCard.mutate(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{card ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
            <DialogDescription>
              Vincule um cliente e defina o valor estimado da venda.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Oportunidade *</Label>
              <Input 
                id="title" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Reforma Motor V6" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client">Cliente *</Label>
              <Select 
                value={formData.client_id} 
                onValueChange={(val) => setFormData({...formData, client_id: val})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name} ({c.phone})</SelectItem>
                  ))}
                  {clientes.length === 0 && (
                    <p className="p-2 text-xs text-muted-foreground text-center">Nenhum cliente cadastrado.</p>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="value">Valor Estimado (R$)</Label>
                <Input 
                  id="value" 
                  type="number"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({...formData, estimated_value: e.target.value})}
                  placeholder="0.00" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stage">Etapa Inicial</Label>
                <Select 
                  value={formData.stage_key} 
                  onValueChange={(val) => setFormData({...formData, stage_key: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEC_STAGES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 min-w-[120px]" disabled={createCard.isPending}>
              {createCard.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {card ? 'Salvar' : 'Criar Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
