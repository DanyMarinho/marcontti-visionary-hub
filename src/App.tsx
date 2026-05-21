import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RootLayout } from '@/components/layout/RootLayout';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { pageTransition } from '@/lib/animations';

const Home = lazy(() => import('@/pages/Home'));
const CRM = lazy(() => import('@/pages/CRM'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const WhatsApp = lazy(() => import('@/pages/WhatsApp'));
const Automations = lazy(() => import('@/pages/Automations'));

const AnimatedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" className="h-full" />}>
            <AnimatedRoute>
              <Home />
            </AnimatedRoute>
          </Suspense>
        ),
      },
      {
        path: 'crm',
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" className="h-full" />}>
            <AnimatedRoute>
              <CRM />
            </AnimatedRoute>
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<SkeletonLoader variant="chart" className="h-full" />}>
            <AnimatedRoute>
              <Dashboard />
            </AnimatedRoute>
          </Suspense>
        ),
      },
      {
        path: 'whatsapp',
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" className="h-full" />}>
            <AnimatedRoute>
              <WhatsApp />
            </AnimatedRoute>
          </Suspense>
        ),
      },
      {
        path: 'automacoes',
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" className="h-full" />}>
            <AnimatedRoute>
              <Automations />
            </AnimatedRoute>
          </Suspense>
        ),
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;