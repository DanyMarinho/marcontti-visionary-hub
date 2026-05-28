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
import { Loader2, Upload } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { pipelineService } from '@/services/pipelineService';
import { Niche, Tenant } from '@/types';
import { toast } from 'sonner';

interface TenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  tenant?: Tenant;
}

const NICHES: { value: Niche; label: string }[] = [
  { value: 'comercio_local', label: 'Comércio Local' },
  { value: 'mecanica', label: 'Mecânica' },
  { value: 'clinica', label: 'Clínica' },
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'educacao', label: 'Educação' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'outro', label: 'Outro' },
];

export function TenantForm({ open, onOpenChange, onSuccess, tenant }: TenantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Tenant>>(
    tenant || {
      name: '',
      niche: 'comercio_local',
      contact_email: '',
      cnpj: '',
      color: '#f97316',
      status: 'ativo',
      plan: 'basico'
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact_email) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      if (tenant?.id) {
        await tenantService.update(tenant.id, formData);
        toast.success('Empresa atualizada com sucesso');
      } else {
        const newTenant = await tenantService.create(formData as any);
        // Automatic insertion of default pipeline stages
        await pipelineService.createDefaultStages(newTenant.id);
        toast.success('Empresa e Pipeline criados com sucesso');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving tenant:', error);
      toast.error('Erro ao salvar empresa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{tenant ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}</DialogTitle>
            <DialogDescription>
              Preencha os dados da empresa. O Pipeline do Método MEC será gerado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Fantasia *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome da empresa" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="niche">Nicho *</Label>
                <Select 
                  value={formData.niche} 
                  onValueChange={(value: Niche) => setFormData({...formData, niche: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input 
                  id="cnpj" 
                  value={formData.cnpj} 
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  placeholder="00.000.000/0001-00" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail de Contato *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.contact_email} 
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  placeholder="contato@empresa.com" 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Logotipo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <Button type="button" variant="outline" size="sm">Fazer Upload</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="color">Cor da Marca</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={formData.color} 
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-12 h-10 p-1" 
                  />
                  <Input 
                    value={formData.color} 
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="#f97316"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Plano</Label>
                <Select 
                  value={formData.plan} 
                  onValueChange={(value: any) => setFormData({...formData, plan: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#f97316] hover:bg-[#f97316]/90 min-w-[120px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {tenant ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
