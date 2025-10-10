import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl [font-family:'Lexend',Helvetica]">Loading...</div>
      </div>
    );
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl [font-family:'Lexend',Helvetica]">Loading...</div>
      </div>
    );
  }

  if (profile?.role === 'superadmin') {
    return <Navigate to="/superadmin" replace />;
  }

  return <AdminDashboard />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl [font-family:'Lexend',Helvetica]">Loading...</div>
      </div>
    );
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
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
