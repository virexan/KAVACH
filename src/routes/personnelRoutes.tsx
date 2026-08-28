import React from 'react';
import type { RouteObject } from 'react-router-dom';

const PersonnelDashboardPage = React.lazy(() => import('@/pages/personnel/PersonnelDashboardPage'));
const DailyCheckInPage = React.lazy(() => import('@/pages/personnel/DailyCheckInPage'));
const WellnessHistoryPage = React.lazy(() => import('@/pages/personnel/WellnessHistoryPage'));
const WellnessTrendsPage = React.lazy(() => import('@/pages/personnel/WellnessTrendsPage'));
const PersonalRiskPage = React.lazy(() => import('@/pages/personnel/PersonalRiskPage'));
const RecommendationsPage = React.lazy(() => import('@/pages/personnel/RecommendationsPage'));
const ResourcesPage = React.lazy(() => import('@/pages/personnel/ResourcesPage'));
const ConsentPage = React.lazy(() => import('@/pages/personnel/ConsentPage'));
const NotificationsPage = React.lazy(() => import('@/pages/personnel/NotificationsPage'));
const PersonnelSettingsPage = React.lazy(() => import('@/pages/personnel/PersonnelSettingsPage'));
const AssistantPage = React.lazy(() => import('@/pages/assistant/AssistantPage'));

export const personnelRoutes: RouteObject[] = [
  {
    path: 'personnel',
    handle: { breadcrumb: 'Personnel' },
    children: [
      {
        path: '',
        element: <PersonnelDashboardPage />,
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'check-in',
        element: <DailyCheckInPage />,
        handle: { breadcrumb: 'Daily Check-In' },
      },
      {
        path: 'history',
        element: <WellnessHistoryPage />,
        handle: { breadcrumb: 'Wellness History' },
      },
      {
        path: 'trends',
        element: <WellnessTrendsPage />,
        handle: { breadcrumb: 'Trends' },
      },
      {
        path: 'risk',
        element: <PersonalRiskPage />,
        handle: { breadcrumb: 'Welfare Overview' },
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
        handle: { breadcrumb: 'Recommendations' },
      },
      {
        path: 'resources',
        element: <ResourcesPage />,
        handle: { breadcrumb: 'Welfare Resources' },
      },
      {
        path: 'consent',
        element: <ConsentPage />,
        handle: { breadcrumb: 'Consent' },
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
        handle: { breadcrumb: 'Notifications' },
      },
      {
        path: 'settings',
        element: <PersonnelSettingsPage />,
        handle: { breadcrumb: 'Profile & Settings' },
      },
      {
        path: 'assistant',
        element: <AssistantPage />,
        handle: { breadcrumb: 'Welfare AI Assistant' },
      },
    ],
  },
];
export default personnelRoutes;
