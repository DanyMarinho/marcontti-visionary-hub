import React, { useState, useEffect } from 'react';
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
import { Loader2, UserPlus } from 'lucide-react';
import { userService } from '@/services/userService';
import { storeService } from '@/services/storeService';
import { User, Store, Role } from '@/types';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

interface VendedorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user?: User;
}

export function VendedorForm({ open, onOpenChange, onSuccess, user }: VendedorFormProps) {
  const { tenants } = useAuthStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      full_name: '',
      email: '',
      phone: '',
      role: 'vendedor',
      tenant_id: tenants[0]?.id || '',
      store_id: ''
    }
  );

  useEffect(() => {
    if (formData.tenant_id) {
      storeService.getAll(formData.tenant_id).then(setStores);
    }
  }, [formData.tenant_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.tenant_id) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      if (user?.id) {
        await userService.update(user.id, formData);
        toast.success('Usuário atualizado com sucesso');
      } else {
        await userService.create(formData as any);
        // Invite logic
        await userService.inviteVendor(formData.email!, formData.full_name!, formData.tenant_id!, formData.store_id || '');
        toast.success('Convite enviado com sucesso');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast.error('Erro ao salvar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {user ? 'Altere os dados do usuário.' : 'Cadastre um novo membro na equipe. Um convite será enviado por e-mail.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input 
                id="full_name" 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Ex: João da Silva" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="vendedor@empresa.com" 
                disabled={!!user}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tenant_id">Empresa *</Label>
                <Select 
                  value={formData.tenant_id} 
                  onValueChange={(value) => setFormData({...formData, tenant_id: value, store_id: ''})}
                  disabled={!!user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Perfil *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: Role) => setFormData({...formData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="loja">Gerente (Loja)</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="store_id">Loja Vinculada</Label>
              <Select 
                value={formData.store_id || 'none'} 
                onValueChange={(value) => setFormData({...formData, store_id: value === 'none' ? undefined : value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma (Acesso Geral)</SelectItem>
                  {stores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#f97316] hover:bg-[#f97316]/90 min-w-[120px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (user ? 'Salvar' : 'Convidar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
