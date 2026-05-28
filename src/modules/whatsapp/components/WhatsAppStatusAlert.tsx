import React from 'react';
import { useWhatsAppInstance } from '@/modules/whatsapp/hooks/useWhatsAppInstance';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Smartphone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function WhatsAppStatusAlert() {
  const { instance } = useWhatsAppInstance();
  const navigate = useNavigate();

  if (!instance || instance.status === 'connected') return null;

  return (
    <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-500">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-[10px] font-black uppercase tracking-widest">WhatsApp Desconectado</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <p className="text-xs font-medium">Sua instância do WhatsApp está desconectada. Você não poderá receber ou enviar mensagens automáticas.</p>
        <Button 
          size="sm" 
          className="bg-red-600 hover:bg-red-700 text-white h-8 text-[10px] font-bold uppercase tracking-wider"
          onClick={() => navigate('/whatsapp/connect')}
        >
          <RefreshCw size={14} className="mr-2" /> Reconectar Agora
        </Button>
      </AlertDescription>
    </Alert>
  );
}
