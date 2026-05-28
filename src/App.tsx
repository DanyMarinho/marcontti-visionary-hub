import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Layout from './components/Layout';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/crm" element={<CRM />} />
                  <Route path="/whatsapp" element={<div>WhatsApp / Agente IA</div>} />
                  <Route path="/metrics" element={<div>Métricas</div>} />
                  <Route path="/projection" element={<div>Projeção Financeira</div>} />
                  <Route path="/vendors" element={<div>Vendedores</div>} />
                  <Route path="/shops" element={<div>Lojas</div>} />
                  <Route path="/settings" element={<div>Configurações</div>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
