import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { useWhatsAppInstance } from './hooks/useWhatsAppInstance';
import { cn } from '@/lib/utils';
import { useTenant } from '@/hooks/useTenant';

export function QRCodeConnect() {
  const { instance, isLoading, upsertInstance, connectInstance } = useWhatsAppInstance();
  const { activeTenant } = useTenant();
  const [showConfig, setShowConfig] = useState(false);
  const [qrTimeout, setQrTimeout] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  const [formData, setFormData] = useState({
    instance_name: '',
    evolution_url: 'https://evolution.example.com',
    api_key: ''
  });

  useEffect(() => {
    if (instance) {
      setFormData({
        instance_name: instance.instance_name,
        evolution_url: instance.evolution_url,
        api_key: instance.api_key
      });
      if (instance.status === 'disconnected') {
        setShowConfig(false);
      }
    } else {
      setShowConfig(true);
    }
  }, [instance]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    upsertInstance.mutate(formData);
  };

  const handleGenerateQR = () => {
    setQrTimeout(false);
    setCountdown(30);
    connectInstance.mutate(instance!.id);
  };

  useEffect(() => {
    let timer: any;
    if (instance?.status === 'connecting' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && instance?.status === 'connecting') {
      setQrTimeout(true);
    }
    return () => clearInterval(timer);
  }, [instance?.status, countdown]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-orange-500/20 bg-[#0a0a0a]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-white flex items-center gap-2">
                Conectar WhatsApp
                {instance?.status && (
                  <Badge className={cn(
                    "ml-2",
                    instance.status === 'connected' ? "bg-green-500" : 
                    instance.status === 'connecting' ? "bg-yellow-500 text-black" : "bg-red-500"
                  )}>
                    {instance.status === 'connected' ? 'Conectado' : 
                     instance.status === 'connecting' ? 'Conectando...' : 'Desconectado'}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Vincule uma instância da Evolution API ao tenant {activeTenant?.name}.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowConfig(!showConfig)}>
              {showConfig ? 'Ver Status' : 'Configurações'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showConfig ? (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="instance_name">Nome da Instância</Label>
                <Input 
                  id="instance_name" 
                  value={formData.instance_name}
                  onChange={(e) => setFormData({...formData, instance_name: e.target.value})}
                  placeholder="ex: clinica_vida_01" 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="evolution_url">URL da Evolution API</Label>
                <Input 
                  id="evolution_url" 
                  value={formData.evolution_url}
                  onChange={(e) => setFormData({...formData, evolution_url: e.target.value})}
                  placeholder="https://sua-api.com" 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api_key">Global API Key</Label>
                <Input 
                  id="api_key" 
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                  placeholder="Sua chave secreta" 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={upsertInstance.isPending}>
                {upsertInstance.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Configurações
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              {instance?.status === 'connected' ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">WhatsApp Conectado ✓</h3>
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                      <Smartphone size={16} /> {instance.phone_number || 'Número vinculado'}
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                    Desconectar Instância
                  </Button>
                </div>
              ) : instance?.status === 'connecting' ? (
                <div className="text-center space-y-6">
                  <div className="bg-white p-6 rounded-xl mx-auto inline-block border-4 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    {/* Simulated QR Code */}
                    <QrCode size={200} className="text-black" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Escaneie o QR Code no seu WhatsApp</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Abra o WhatsApp {'>'} Configurações {'>'} Dispositivos Conectados {'>'} Conectar um Dispositivo.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                      <RefreshCw size={14} className="animate-spin" /> Aguardando leitura...
                    </div>
                    <p className="text-[10px] text-[#888888] font-bold">O QR Code expira em {countdown}s</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800">
                    <Smartphone size={32} className="text-zinc-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">WhatsApp Desconectado</h3>
                    <p className="text-sm text-muted-foreground">Clique abaixo para gerar um novo QR Code de conexão.</p>
                  </div>
                  <Button onClick={handleGenerateQR} className="bg-orange-500 hover:bg-orange-600">
                    <RefreshCw className="mr-2 h-4 w-4" /> Gerar QR Code
                  </Button>
                </div>
              )}

              {qrTimeout && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 max-w-sm">
                  <AlertCircle size={18} className="mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tempo esgotado</p>
                    <p className="text-xs">Não foi possível gerar o QR Code. Verifique sua conexão e tente novamente.</p>
                    <Button size="sm" variant="outline" className="h-7 border-red-500/50 text-red-500 hover:bg-red-500/10" onClick={handleGenerateQR}>
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
