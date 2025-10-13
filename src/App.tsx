import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Login } from './screens/Login/Login';
import { SuperAdminAnalytics } from './screens/SuperAdminDashboard/SuperAdminAnalytics';
import { SuperAdminAllQuotes } from './screens/SuperAdminDashboard/SuperAdminAllQuotes';
import { SuperAdminAccounts } from './screens/SuperAdminDashboard/SuperAdminAccounts';
import { AdminDashboard } from './screens/AdminDashboard/AdminDashboard';
import { CreateQuote } from './screens/CreateQuote/CreateQuote';
import { AllQuotes } from './screens/AllQuotes/AllQuotes';
import { UserSettings } from './screens/UserSettings/UserSettings';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: ('superadmin' | 'admin')[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (profile?.role === 'superadmin') {
    return <Navigate to="/superadmin" replace />;
  }

  return <AdminDashboard />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/all-quotes"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminAllQuotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/accounts"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminAccounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-quote"
        element={
          <ProtectedRoute>
            <CreateQuote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-quotes"
        element={
          <ProtectedRoute>
            <AllQuotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <UserSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
