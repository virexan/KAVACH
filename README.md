# KAVACH - AI-Powered Welfare & Workload Analysis Platform

KAVACH is a secure, responsive React + TypeScript web application built using Vite, Tailwind CSS, and TanStack Query. It serves as a unified welfare and workload evaluation platform, accommodating four distinct user roles: Personnel, Welfare Officers, Commanding Officers, and Administrators.

---

## 1. Quick Start

### Local Development Setup

To run the application locally on your machine, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   This will start the local Vite development server (typically at `http://localhost:5173`).

3. **Production Build & Preview:**
   Verify compilation and tree-shaking with:
   ```bash
   npm run build
   npm run preview
   ```

### Running with Docker

To containerize the frontend client and serve it through Nginx (configured with fallback routing and Content Security Policy rules):

1. **Build and spin up container:**
   ```bash
   docker compose up -d --build
   ```

2. **Access the application:**
   Open your browser at `http://localhost:8080`.

---

## 2. seeded Demo Logins (Mock Environment)

To test the role-based views and guards, a **Demo Accounts** panel is visible below the login form when running with `VITE_USE_MOCKS=true` (autofillable with one click). 

All demo accounts share the password: **`demo1234`**

| Persona | Service ID / Username | Role Constant | Permissions | Default Redirect |
|---|---|---|---|---|
| **Personnel** | `PERS001` | `PERSONNEL` | `view:own-wellness`, `edit:own-checkin` | `/personnel` |
| **Welfare Officer** | `OFF001` | `WELFARE_OFFICER` | `view:cases`, `edit:interventions` | `/officer` |
| **Commander** | `CMD001` | `COMMANDER` | `view:aggregate` | `/commander` |
| **Administrator** | `ADM001` | `ADMIN` | `manage:users`, `manage:config` | `/admin` |

---

## 3. Session & Token Handling Architecture

To mimic a secure production environment, KAVACH implements the following session strategies:

1. **In-Memory Access Tokens**:
   The short-lived `accessToken` is stored strictly in memory (`useAuthStore` Zustand state) and is never written to `localStorage` or cookies. This reduces token exposure to Cross-Site Scripting (XSS) vectors.
2. **Refresh Token Storage**:
   The long-lived `refreshToken` is simulated inside `sessionStorage` (representing the real-world backend `httpOnly`, Secure, SameSite=Strict cookie).
3. **Silent Session Restore**:
   Upon loading the application, if a session flag (`kavach_has_session`) exists in `sessionStorage`, `authStore.initialize()` automatically triggers `authService.refresh()` to fetch a new access token, preventing login screen flickering.
4. **Periodic Auto-Refresh**:
   A background timer checks session activity. It silently refreshes the access token every 10 minutes (before the 15-minute access token expires) to prevent user interruption.
5. **Global 401 Interceptors**:
   TanStack Query's `queryClient` is configured with a cache interceptor. If any query or mutation receives a `401 Unauthorized` API error, it attempts token refresh once. If refresh fails, it flushes query caches (`queryClient.clear()`) to prevent data leakage and redirects to `/session-expired`.
6. **Inactivity Idle Timer**:
   The `useSessionTimeout` hook monitors mouse and keyboard events. If no interaction is detected for 13 minutes, a warning toast appears. At 15 minutes of idle time, the user is logged out and redirected to `/session-expired`.

---

## 4. How to Add a New Page to a Protected Route Group

Route protection is set up at the route-group level in `rootRoutes.tsx`, meaning that **adding a new page inside a protected folder automatically inherits security and requires zero new guard code**.

### Adding a new page (e.g. "Risk Alerts Detail" under Welfare Officer):

1. **Create the page component:**
   Create `src/pages/officer/AlertDetailsPage.tsx`:
   ```tsx
   import React from 'react';
   export const AlertDetailsPage: React.FC = () => {
     return (
       <div className="space-y-4">
         <h1 className="text-xl font-bold">Alert Details</h1>
         <p className="text-sm text-textSecondary">Inspection portal for case details.</p>
       </div>
     );
   };
   export default AlertDetailsPage;
   ```

2. **Register the route in the sub-routes group:**
   Open `src/routes/officerRoutes.tsx` and register the page:
   ```tsx
   const AlertDetailsPage = React.lazy(() => import('@/pages/officer/AlertDetailsPage'));

   export const officerRoutes: RouteObject[] = [
     {
       path: 'officer',
       handle: { breadcrumb: 'Officer' },
       children: [
         {
           path: '',
           element: <OfficerHomePlaceholder />,
           handle: { breadcrumb: 'Dashboard' },
         },
         {
           path: 'alerts/:id',
           element: <AlertDetailsPage />,
           handle: { breadcrumb: 'Alert Details' },
         },
       ],
     },
   ];
   ```

3. **Verify enforcement:**
   Because `officerRoutes` is wrapped by `RoleGuard allowedRoles={['WELFARE_OFFICER']}` inside `rootRoutes.tsx`, trying to navigate to `/officer/alerts/123` as a `Personnel` or guest will redirect immediately to `/forbidden` or `/login`.

---

## 5. Security & Privacy Defaults

- **Generic Credentials Error**: Mismatches on sign-in throw a single generic notice: `"Invalid Service ID or password."` to block username enumeration attacks.
- **Cache Purging**: Executing sign-out triggers `queryClient.clear()` immediately, wiping the cache memory to prevent session leakages on shared agency machines.
- **Client-Side Boundaries**: Frontend guards are designed for user-experience routing convenience only. Real enforcement boundaries are verified server-side on every endpoint (PRD 10 backend integration points).
- **Audit Logging Hooks**: Auth actions contain hook registration points (documented for future logging systems in PRD 8).
