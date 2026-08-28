import React from 'react';
import type { RouteObject } from 'react-router-dom';

const AdminDashboardPage = React.lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsersPage = React.lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminUserPage = React.lazy(() => import('@/pages/admin/AdminUserPage'));
const AdminRolesPage = React.lazy(() => import('@/pages/admin/AdminRolesPage'));
const AdminUnitsPage = React.lazy(() => import('@/pages/admin/AdminUnitsPage'));
const AdminConsentPage = React.lazy(() => import('@/pages/admin/AdminConsentPage'));
const AdminAuditPage = React.lazy(() => import('@/pages/admin/AdminAuditPage'));
const AdminAIPage = React.lazy(() => import('@/pages/admin/AdminAIPage'));
const AdminSystemHealthPage = React.lazy(() => import('@/pages/admin/AdminSystemHealthPage'));
const AdminSettingsPage = React.lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AssistantPage = React.lazy(() => import('@/pages/assistant/AssistantPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    handle: { breadcrumb: 'Admin' },
    children: [
      {
        path: '',
        element: <AdminDashboardPage />,
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'users',
        handle: { breadcrumb: 'Users Directory' },
        children: [
          {
            path: '',
            element: <AdminUsersPage />,
          },
          {
            path: ':userId',
            element: <AdminUserPage />,
            handle: { breadcrumb: 'User Profile' },
          },
        ],
      },
      {
        path: 'roles',
        element: <AdminRolesPage />,
        handle: { breadcrumb: 'Roles & Permissions' },
      },
      {
        path: 'units',
        element: <AdminUnitsPage />,
        handle: { breadcrumb: 'Units Scope' },
      },
      {
        path: 'consent',
        element: <AdminConsentPage />,
        handle: { breadcrumb: 'Consent Governance' },
      },
      {
        path: 'audit',
        element: <AdminAuditPage />,
        handle: { breadcrumb: 'Audit Trail' },
      },
      {
        path: 'ai',
        element: <AdminAIPage />,
        handle: { breadcrumb: 'Model Management' },
      },
      {
        path: 'system-health',
        element: <AdminSystemHealthPage />,
        handle: { breadcrumb: 'System Health' },
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
        handle: { breadcrumb: 'System Settings' },
      },
      {
        path: 'assistant',
        element: <AssistantPage />,
        handle: { breadcrumb: 'Welfare AI Assistant' },
      },
    ],
  },
];
export default adminRoutes;
