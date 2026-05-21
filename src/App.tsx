import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';

const Home = lazy(() => import('@/pages/Home'));
const CRM = lazy(() => import('@/pages/CRM'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const WhatsApp = lazy(() => import('@/pages/WhatsApp'));
const Automations = lazy(() => import('@/pages/Automations'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'crm',
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <CRM />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<SkeletonLoader variant="chart" />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'whatsapp',
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <WhatsApp />
          </Suspense>
        ),
      },
      {
        path: 'automacoes',
        element: (
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <Automations />
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