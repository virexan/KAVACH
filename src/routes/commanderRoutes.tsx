import React from 'react';
import type { RouteObject } from 'react-router-dom';

const CommanderDashboardPage = React.lazy(() => import('@/pages/commander/CommanderDashboardPage'));
const CommanderUnitPage = React.lazy(() => import('@/pages/commander/CommanderUnitPage'));
const CommanderTrendsPage = React.lazy(() => import('@/pages/commander/CommanderTrendsPage'));
const CommanderWorkloadPage = React.lazy(() => import('@/pages/commander/CommanderWorkloadPage'));
const CommanderRecommendationsPage = React.lazy(() => import('@/pages/commander/CommanderRecommendationsPage'));
const CommanderReportsPage = React.lazy(() => import('@/pages/commander/CommanderReportsPage'));
const CommanderNotificationsPage = React.lazy(() => import('@/pages/commander/CommanderNotificationsPage'));
const AssistantPage = React.lazy(() => import('@/pages/assistant/AssistantPage'));

export const commanderRoutes: RouteObject[] = [
  {
    path: 'commander',
    handle: { breadcrumb: 'Commander' },
    children: [
      {
        path: '',
        element: <CommanderDashboardPage />,
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'unit/:unitId',
        element: <CommanderUnitPage />,
        handle: { breadcrumb: 'Unit Detail' },
      },
      {
        path: 'trends',
        element: <CommanderTrendsPage />,
        handle: { breadcrumb: 'Welfare Trends' },
      },
      {
        path: 'workload',
        element: <CommanderWorkloadPage />,
        handle: { breadcrumb: 'Workload Overview' },
      },
      {
        path: 'recommendations',
        element: <CommanderRecommendationsPage />,
        handle: { breadcrumb: 'Recommendations' },
      },
      {
        path: 'reports',
        element: <CommanderReportsPage />,
        handle: { breadcrumb: 'Welfare Reports' },
      },
      {
        path: 'notifications',
        element: <CommanderNotificationsPage />,
        handle: { breadcrumb: 'System Alerts' },
      },
      {
        path: 'assistant',
        element: <AssistantPage />,
        handle: { breadcrumb: 'Welfare AI Assistant' },
      },
    ],
  },
];
export default commanderRoutes;
