import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MessageSquare, GitMerge, Tag, Phone, Mail, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationView } from '@/modules/whatsapp/ConversationView';
import { usePipeline } from '@/modules/pipeline/hooks/usePipeline';
import { KanbanCard } from '@/modules/pipeline/components/KanbanCard';

interface ClienteDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: any;
}

export function ClienteDetails({ open, onOpenChange, cliente }: ClienteDetailsProps) {
  const { cards } = usePipeline();
  const clienteCards = cards.filter(c => c.client_id === cliente?.id);

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
              {cliente.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="text-xl">{cliente.full_name}</DialogTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] uppercase">{cliente.status}</Badge>
                {cliente.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] bg-orange-100 text-orange-600 border-none">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="dados" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="px-6 border-b rounded-none bg-transparent h-12 justify-start gap-4">
            <TabsTrigger value="dados" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 h-12">
              <User size={16} className="mr-2" /> Dados
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 h-12">
              <MessageSquare size={16} className="mr-2" /> WhatsApp
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 h-12">
              <GitMerge size={16} className="mr-2" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="tags" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 h-12">
              <Tag size={16} className="mr-2" /> Tags
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="dados" className="m-0 p-6 h-full overflow-y-auto">
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold">WhatsApp</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-orange-500" /> {cliente.phone}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold">E-mail</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-orange-500" /> {cliente.email || '-'}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold">Endereço</Label>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-orange-500" /> {cliente.address || '-'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold">Observações Internas</Label>
                  <div className="p-4 rounded-lg bg-muted/30 text-sm italic min-h-[100px]">
                    {cliente.notes || 'Sem observações registradas.'}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="m-0 h-full">
              <ConversationView clientId={cliente.id} />
            </TabsContent>

            <TabsContent value="pipeline" className="m-0 p-6 h-full overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Oportunidades Ativas</h3>
                {clienteCards.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <GitMerge size={32} className="mx-auto text-muted-foreground opacity-20 mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum card vinculado a este cliente.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clienteCards.map(card => (
                      <KanbanCard key={card.id} card={card} onClick={() => {}} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tags" className="m-0 p-6 h-full overflow-y-auto">
               <div className="space-y-4">
                 <Label>Tags do Cliente</Label>
                 <div className="flex flex-wrap gap-2">
                   {cliente.tags?.map((tag: string) => (
                     <Badge key={tag} className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20">
                       {tag}
                     </Badge>
                   ))}
                   {(!cliente.tags || cliente.tags.length === 0) && (
                     <p className="text-sm text-muted-foreground">Nenhuma tag atribuída.</p>
                   )}
                 </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper Label since it's used
import { Label } from "@/components/ui/label";
