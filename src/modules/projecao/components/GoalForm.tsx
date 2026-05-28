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
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: any;
}

export function GoalForm({ open, onOpenChange, goal }: GoalFormProps) {
  const { activeTenantId } = useTenant();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    target_value: '',
    period_start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    period_end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    scope: 'tenant' as 'tenant' | 'store' | 'seller',
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        target_value: goal.target_value?.toString() || '',
        period_start: goal.period_start || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        period_end: goal.period_end || format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        scope: goal.scope || 'tenant'
      });
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenantId) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('goals')
        .upsert([{
          ...formData,
          target_value: Number(formData.target_value),
          tenant_id: activeTenantId
        }]);

      if (error) throw error;
      
      toast.success('Meta salva com sucesso');
      queryClient.invalidateQueries({ queryKey: ['projecao-financeira'] });
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao salvar meta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{goal ? 'Editar Meta' : 'Nova Meta de Vendas'}</DialogTitle>
            <DialogDescription>
              Defina o valor e o período para esta meta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="target">Valor da Meta (R$) *</Label>
              <Input 
                id="target" 
                type="number"
                required
                value={formData.target_value}
                onChange={(e) => setFormData({...formData, target_value: e.target.value})}
                placeholder="50000" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start">Início</Label>
                <Input 
                  id="start" 
                  type="date"
                  value={formData.period_start}
                  onChange={(e) => setFormData({...formData, period_start: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">Fim</Label>
                <Input 
                  id="end" 
                  type="date"
                  value={formData.period_end}
                  onChange={(e) => setFormData({...formData, period_end: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scope">Escopo</Label>
              <Select 
                value={formData.scope} 
                onValueChange={(val: any) => setFormData({...formData, scope: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant">Toda a Unidade (Tenant)</SelectItem>
                  <SelectItem value="store">Loja Específica</SelectItem>
                  <SelectItem value="seller">Vendedor Específico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 min-w-[120px]" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {goal ? 'Salvar' : 'Criar Meta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
