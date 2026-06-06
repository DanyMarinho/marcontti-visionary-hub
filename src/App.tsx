import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import AppShell from "./components/layout/AppShell";
import { Skeleton } from "./components/ui/skeleton";
import { useAuth } from "./hooks/useAuth";
import type { Role } from "./types";

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
const NewTenantWizard = lazy(() => import('./pages/Setup/NewTenantWizard'));
const Settings = lazy(() => import("./pages/Settings"));
const Metricas = lazy(() => import("./modules/metricas/Metricas"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProjecaoFinanceira = lazy(() => import("./modules/projecao/ProjecaoFinanceira"));
const Reactivation = lazy(() => import("./pages/Reactivation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));


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

const Shell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const publicRoutes = ['/login', '/reset-password'];
  const { isAuthenticated, isLoading } = useAuth();

  if (publicRoutes.includes(location.pathname)) return <>{children}</>;
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
};

const RequireRole = ({ roles, children }: { roles: Role[]; children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <BrowserRouter>
          <Shell>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/crm" element={<ClienteList />} />
                <Route path="/pipeline" element={<KanbanBoard />} />
                <Route path="/whatsapp" element={<WhatsAppInbox />} />
                <Route path="/whatsapp/connect" element={<QRCodeConnect />} />
                <Route path="/ai-agent" element={<RequireRole roles={['admin','loja']}><AgenteIAConfig /></RequireRole>} />
                <Route path="/ai-agent/logs" element={<RequireRole roles={['admin','loja']}><AgenteIALogs /></RequireRole>} />
                <Route path="/tenants" element={<RequireRole roles={['admin']}><TenantList /></RequireRole>} />
                <Route path="/shops" element={<RequireRole roles={['admin']}><LojaList /></RequireRole>} />
                <Route path="/vendors" element={<RequireRole roles={['admin']}><VendedorList /></RequireRole>} />
                <Route path="/team" element={<RequireRole roles={['admin','loja']}><VendedorList /></RequireRole>} />
                <Route path="/metrics" element={<Metricas />} />
                <Route path="/projection" element={<RequireRole roles={['admin']}><ProjecaoFinanceira /></RequireRole>} />
                <Route path="/reactivation" element={<Reactivation />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/setup/new-tenant" element={<RequireRole roles={['admin']}><NewTenantWizard /></RequireRole>} />
              </Routes>
            </Suspense>
          </Shell>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
