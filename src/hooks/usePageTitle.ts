import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/crm": "Clientes",
  "/pipeline": "Pipeline",
  "/whatsapp": "Conversas",
  "/whatsapp/connect": "Conectar WhatsApp",
  "/ai-agent": "Configurações da IA",
  "/ai-agent/logs": "Logs da IA",
  "/tenants": "Unidades",
  "/shops": "Lojas",
  "/vendors": "Vendedores",
  "/team": "Equipe",
  "/metrics": "Métricas",
  "/projection": "Projeção Financeira",
  "/settings": "Configurações",
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || "Página";
    document.title = `MEC Hub — ${title}`;
  }, [location.pathname]);
}
