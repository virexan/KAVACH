import React from 'react';
import type { RouteObject } from 'react-router-dom';

const LandingPage = React.lazy(() => import('@/pages/public/LandingPage'));
const LoginPage = React.lazy(() => import('@/pages/public/LoginPage'));
const UnauthorizedPage = React.lazy(() => import('@/pages/public/UnauthorizedPage'));
const ForbiddenPage = React.lazy(() => import('@/pages/public/ForbiddenPage'));
const SessionExpiredPage = React.lazy(() => import('@/pages/public/SessionExpiredPage'));
const PrivacyNoticeStub = React.lazy(() => import('@/pages/public/PrivacyNoticeStub'));
const NotFoundPage = React.lazy(() => import('@/pages/public/NotFoundPage'));

export const publicRoutes: RouteObject[] = [
  {
    path: 'landing',
    element: <LandingPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: 'forbidden',
    element: <ForbiddenPage />,
  },
  {
    path: 'session-expired',
    element: <SessionExpiredPage />,
  },
  {
    path: 'privacy',
    element: <PrivacyNoticeStub />,
  },
  {
    path: '404',
    element: <NotFoundPage />,
  },
];
export default publicRoutes;
