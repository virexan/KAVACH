import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import AppShellLayout from '@/components/layout/AppShellLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import RoleGuard from '@/components/auth/RoleGuard';
import Skeleton from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';

import publicRoutes from './publicRoutes';
import personnelRoutes from './personnelRoutes';
import officerRoutes from './officerRoutes';
import commanderRoutes from './commanderRoutes';
import adminRoutes from './adminRoutes';

const NotFoundPage = React.lazy(() => import('@/pages/public/NotFoundPage'));

// Dev-only routes conditionally compiled and tree-shaken in production
const ComponentShowcasePage = !import.meta.env.PROD
  ? React.lazy(() => import('@/pages/dev/ComponentShowcasePage'))
  : null;

const devRoutes: RouteObject[] = ComponentShowcasePage
  ? [
      {
        path: 'dev',
        handle: { breadcrumb: 'Development' },
        children: [
          {
            path: 'components',
            element: <ComponentShowcasePage />,
            handle: { breadcrumb: 'Showcase' },
          },
        ],
      },
    ]
  : [];

// Root level redirect component mapping active session states (FR-10)
const RootRedirect: React.FC = () => {
  const { isAuthenticated, user, isInitializing, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isInitializing) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton variant="line" className="h-8 w-1/4 mb-4" />
        <Skeleton variant="block" className="h-48 w-full mb-6" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case 'PERSONNEL':
        return <Navigate to="/personnel" replace />;
      case 'WELFARE_OFFICER':
        return <Navigate to="/officer" replace />;
      case 'COMMANDER':
        return <Navigate to="/commander" replace />;
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Navigate to="/landing" replace />;
};

export const rootRoutes: RouteObject[] = [
  // Root Redirect
  {
    path: '/',
    element: <RootRedirect />,
  },
  
  // Public Routes (outside app shell layout)
  ...publicRoutes,

  // Protected Routes (inside app shell layout, guarded by AuthGuard)
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShellLayout />,
        children: [
          // Personnel Routes
          {
            element: <RoleGuard allowedRoles={['PERSONNEL']} />,
            children: personnelRoutes,
          },
          // Welfare Officer Routes
          {
            element: <RoleGuard allowedRoles={['WELFARE_OFFICER']} />,
            children: officerRoutes,
          },
          // Commander Routes
          {
            element: <RoleGuard allowedRoles={['COMMANDER']} />,
            children: commanderRoutes,
          },
          // Admin Routes
          {
            element: <RoleGuard allowedRoles={['ADMIN']} />,
            children: adminRoutes,
          },
          // Dev-only Showcase
          ...devRoutes,
        ],
      },
    ],
  },

  // Fallback Catch All
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default rootRoutes;
