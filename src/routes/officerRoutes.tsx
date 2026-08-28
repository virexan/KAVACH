import React from 'react';
import type { RouteObject } from 'react-router-dom';

const OfficerDashboardPage = React.lazy(() => import('@/pages/officer/OfficerDashboardPage'));
const OfficerAlertsPage = React.lazy(() => import('@/pages/officer/OfficerAlertsPage'));
const OfficerCasesPage = React.lazy(() => import('@/pages/officer/OfficerCasesPage'));
const OfficerCasePage = React.lazy(() => import('@/pages/officer/OfficerCasePage'));
const OfficerRecommendationsPage = React.lazy(() => import('@/pages/officer/OfficerRecommendationsPage'));
const OfficerTrendsPage = React.lazy(() => import('@/pages/officer/OfficerTrendsPage'));
const OfficerInterventionsPage = React.lazy(() => import('@/pages/officer/OfficerInterventionsPage'));
const OfficerNotificationsPage = React.lazy(() => import('@/pages/officer/OfficerNotificationsPage'));
const AssistantPage = React.lazy(() => import('@/pages/assistant/AssistantPage'));

export const officerRoutes: RouteObject[] = [
  {
    path: 'officer',
    handle: { breadcrumb: 'Officer' },
    children: [
      {
        path: '',
        element: <OfficerDashboardPage />,
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'alerts',
        element: <OfficerAlertsPage />,
        handle: { breadcrumb: 'Priority Alerts' },
      },
      {
        path: 'cases',
        handle: { breadcrumb: 'Case Directory' },
        children: [
          {
            path: '',
            element: <OfficerCasesPage />,
          },
          {
            path: ':caseId',
            element: <OfficerCasePage />,
            handle: { breadcrumb: 'Case Profile' },
          },
        ],
      },
      {
        path: 'recommendations',
        element: <OfficerRecommendationsPage />,
        handle: { breadcrumb: 'Recommendations' },
      },
      {
        path: 'trends',
        element: <OfficerTrendsPage />,
        handle: { breadcrumb: 'Trends' },
      },
      {
        path: 'interventions',
        element: <OfficerInterventionsPage />,
        handle: { breadcrumb: 'Intervention Log' },
      },
      {
        path: 'assistant',
        element: <AssistantPage />,
        handle: { breadcrumb: 'Welfare AI Assistant' },
      },
      {
        path: 'notifications',
        element: <OfficerNotificationsPage />,
        handle: { breadcrumb: 'System Logs' },
      },
    ],
  },
];
export default officerRoutes;
