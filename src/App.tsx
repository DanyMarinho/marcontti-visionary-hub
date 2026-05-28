import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import WhatsApp from './pages/WhatsApp';
import Projection from './pages/Projection';
import Vendors from './pages/Vendors';
import Settings from './pages/Settings';
import Layout from './components/Layout';




function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/whatsapp" element={<WhatsApp />} />
                <Route path="/metrics" element={<Dashboard />} />
                <Route path="/projection" element={<Projection />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/shops" element={<div>Lojas</div>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
