import React from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, AlertCircle } from 'lucide-react';
import { useClientes } from './hooks/useClientes';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: any;
}

export function ClienteForm({ open, onOpenChange, cliente }: ClienteFormProps) {
  const { createCliente, updateCliente } = useClientes();
  const [duplicateAlert, setDuplicateAlert] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formData, setFormData] = React.useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'active'
  });

  React.useEffect(() => {
    if (cliente) {
      setFormData({
        full_name: cliente.full_name || '',
        phone: cliente.phone || '',
        email: cliente.email || '',
        address: cliente.address || '',
        notes: cliente.notes || '',
        status: cliente.status || 'active'
      });
    } else {
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        status: 'active'
      });
    }
    setDuplicateAlert(false);
  }, [cliente, open]);

  const handleSubmit = async (e: React.FormEvent, confirmDuplicate = false) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.full_name) newErrors.full_name = 'Nome é obrigatório';
    if (!formData.phone) newErrors.phone = 'WhatsApp é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (cliente) {
      updateCliente.mutate({ id: cliente.id, updates: formData });
      onOpenChange(false);
    } else {
      const result: any = await createCliente.mutateAsync({ ...formData, confirmDuplicate });
      if (result?.isDuplicate) {
        setDuplicateAlert(true);
      } else {
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full h-[100dvh] sm:h-auto flex flex-col p-0 overflow-hidden">
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <DialogHeader className="mb-6">
              <DialogTitle>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
              <DialogDescription>
                {cliente ? 'Atualize os dados cadastrais do cliente.' : 'Cadastre um novo lead ou cliente na sua base.'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {duplicateAlert && (
                <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Telefone Duplicado</AlertTitle>
                  <AlertDescription className="space-y-3">
                    <p>Este telefone já está cadastrado para outro cliente. Deseja continuar mesmo assim?</p>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDuplicateAlert(false)}
                        className="border-red-500/50 text-red-500 hover:bg-red-500/20"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                        onClick={(e) => handleSubmit(e, true)}
                      >
                        Sim, Confirmar
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input 
                  id="full_name" 
                  required
                  value={formData.full_name}
                   onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Ex: João Roberto Silva" 
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.full_name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">WhatsApp (Telefone) *</Label>
                  <Input 
                    id="phone" 
                    required
                    value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="5511999998888" 
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.phone}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val) => setFormData({...formData, status: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="lead_unidentified">Lead Não Identificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="cliente@email.com" 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, Número, Bairro, Cidade" 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea 
                  id="notes" 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notas internas sobre o cliente..." 
                  className="resize-none h-24"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-muted/20 flex flex-row gap-2 justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 min-w-[120px]"
              disabled={createCliente.isPending || updateCliente.isPending}
            >
              {(createCliente.isPending || updateCliente.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cliente ? 'Salvar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
