import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import AppShell from "./components/layout/AppShell";
import { Skeleton } from "./components/ui/skeleton";

// Lazy Loaded Modules
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClienteList = lazy(() => import("./modules/crm/ClienteList"));
const KanbanBoard = lazy(() => import("./modules/pipeline/KanbanBoard"));
const WhatsAppInbox = lazy(() => import("./modules/whatsapp/WhatsAppInbox").then(module => ({ default: module.WhatsAppInbox })));
const QRCodeConnect = lazy(() => import("./modules/whatsapp/QRCodeConnect").then(module => ({ default: module.QRCodeConnect })));
const AgenteIAConfig = lazy(() => import("./modules/agente-ia/AgenteIAConfig").then(module => ({ default: module.AgenteIAConfig })));
const AgenteIALogs = lazy(() => import("./modules/agente-ia/AgenteIALogs").then(module => ({ default: module.AgenteIALogs })));
const TenantList = lazy(() => import("./modules/admin/Tenants/TenantList").then(module => ({ default: module.TenantList })));
const LojaList = lazy(() => import("./modules/admin/Stores/LojaList").then(module => ({ default: module.LojaList })));
const VendedorList = lazy(() => import("./modules/admin/Vendors/VendedorList").then(module => ({ default: module.VendedorList })));
const Settings = lazy(() => import("./pages/Settings"));
const Metricas = lazy(() => import("./modules/metricas/Metricas"));
const ProjecaoFinanceira = lazy(() => import("./modules/projecao/ProjecaoFinanceira"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-[200px]" />
      <Skeleton className="h-10 w-[120px]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <Skeleton className="h-[400px] w-full" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <BrowserRouter>
          <AppShell>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crm" element={<ClienteList />} />
                <Route path="/pipeline" element={<KanbanBoard />} />
                <Route path="/whatsapp" element={<WhatsAppInbox />} />
                <Route path="/whatsapp/connect" element={<QRCodeConnect />} />
                <Route path="/ai-agent" element={<AgenteIAConfig />} />
                <Route path="/ai-agent/logs" element={<AgenteIALogs />} />
                <Route path="/tenants" element={<TenantList />} />
                <Route path="/shops" element={<LojaList />} />
                <Route path="/vendors" element={<VendedorList />} />
                <Route path="/team" element={<VendedorList />} />
                <Route path="/metrics" element={<Metricas />} />
                <Route path="/projection" element={<ProjecaoFinanceira />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AppShell>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
