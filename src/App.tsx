import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './screens/Login/Login';
import { SuperAdminDashboard } from './screens/SuperAdminDashboard/SuperAdminDashboard';
import { AdminDashboard } from './screens/AdminDashboard/AdminDashboard';
import { CreateQuote } from './screens/CreateQuote/CreateQuote';
import { AllQuotes } from './screens/AllQuotes/AllQuotes';
import { MacbookAir } from './screens/MacbookAir/MacbookAir';
import { StandardQuote } from './screens/StandardQuote/StandardQuote';
import { PremiumQuote } from './screens/PremiumQuote/PremiumQuote';

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
    return <SuperAdminDashboard />;
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
          <ProtectedRoute allowedRoles={['superadmin']}>
            <AdminDashboard />
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
        path="/old-create-quote"
        element={
          <ProtectedRoute>
            <MacbookAir />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quote/standard"
        element={
          <ProtectedRoute>
            <StandardQuote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quote/premium"
        element={
          <ProtectedRoute>
            <PremiumQuote />
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
