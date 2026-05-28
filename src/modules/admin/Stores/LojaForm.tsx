import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { storeService } from '@/services/storeService';
import { Store, Tenant } from '@/types';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

interface LojaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  store?: Store;
}

export function LojaForm({ open, onOpenChange, onSuccess, store }: LojaFormProps) {
  const { tenants } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Store>>(
    store || {
      name: '',
      address: '',
      phone: '',
      manager: '',
      tenant_id: tenants[0]?.id || ''
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tenant_id) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      if (store?.id) {
        await storeService.update(store.id, formData);
        toast.success('Loja atualizada com sucesso');
      } else {
        await storeService.create(formData as any);
        toast.success('Loja cadastrada com sucesso');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving store:', error);
      toast.error('Erro ao salvar loja');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{store ? 'Editar Loja' : 'Nova Loja'}</DialogTitle>
            <DialogDescription>
              Preencha os dados da unidade/loja.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tenant_id">Empresa Vinculada *</Label>
              <Select 
                value={formData.tenant_id} 
                onValueChange={(value) => setFormData({...formData, tenant_id: value})}
                disabled={!!store}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Loja *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Unidade Centro" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="manager">Responsável / Gerente</Label>
              <Input 
                id="manager" 
                value={formData.manager} 
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
                placeholder="Nome do gerente" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(00) 00000-0000" 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Rua, número, bairro..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#f97316] hover:bg-[#f97316]/90 min-w-[100px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
