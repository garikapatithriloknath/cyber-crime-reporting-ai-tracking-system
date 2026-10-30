import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import AuthPortal from './pages/AuthPortal';
import UserDashboardPage from './pages/UserDashboardPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminUpdateStatusPage from './pages/AdminUpdateStatusPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MasterCollageView from './pages/MasterCollageView';
import InstructionsPage from './pages/InstructionsPage';
import Home from './pages/Home';

// Protected Route Component for Citizen Modules
export const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route Component for Admin-Only Modules
export const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

// Root Landing Dispatcher based on Authentication State
const RootLanding = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPortal initialMode="login" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/user-dashboard" replace />;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* 1. Root / Entry point: First shows Login Page */}
        <Route path="/" element={<RootLanding />} />
        <Route path="/login" element={<AuthPortal initialMode="login" />} />
        <Route path="/register" element={<AuthPortal initialMode="register" />} />

        {/* 2. Citizen / User-Accessible Modules */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboardPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboardPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/submit-complaint"
          element={
            <ProtectedUserRoute>
              <SubmitComplaintPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/track-complaint"
          element={
            <ProtectedUserRoute>
              <TrackComplaintPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedUserRoute>
              <MyComplaintsPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedUserRoute>
              <NotificationsPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <ProfilePage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedUserRoute>
              <SettingsPage />
            </ProtectedUserRoute>
          }
        />

        {/* 3. Admin-Accessible Modules */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <SettingsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedAdminRoute>
              <AdminComplaintsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/update-status"
          element={
            <ProtectedAdminRoute>
              <AdminUpdateStatusPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedAdminRoute>
              <AnalyticsPage />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/home" element={<Home />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/collage" element={<MasterCollageView />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
