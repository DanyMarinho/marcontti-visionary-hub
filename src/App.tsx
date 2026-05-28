import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import ClienteList from "./modules/crm/ClienteList";
import WhatsApp from "./pages/WhatsApp";
import { TenantList } from "./modules/admin/Tenants/TenantList";
import { LojaList } from "./modules/admin/Stores/LojaList";
import { VendedorList } from "./modules/admin/Vendors/VendedorList";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/tenants" element={<TenantList />} />
            <Route path="/shops" element={<LojaList />} />
            <Route path="/vendors" element={<VendedorList />} />
            <Route path="/team" element={<VendedorList />} /> {/* Common page for Loja role */}
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
