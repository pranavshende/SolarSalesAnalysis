import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import GeoAnalytics from './pages/GeoAnalytics';
import SalesIntelligence from './pages/SalesIntelligence';
import Forecasting from './pages/Forecasting';
import RevenueDashboard from './pages/RevenueDashboard';
import ReportBuilder from './pages/ReportBuilder';
import InnovationHub from './pages/InnovationHub';
import Analytics from './pages/Analytics';
import SolarWalkthrough from './pages/SolarWalkthrough';
import ProjectOverview from './pages/ProjectOverview';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ExecutiveDashboard />} />
            <Route path="geo" element={<GeoAnalytics />} />
            <Route path="sales" element={<SalesIntelligence />} />
            <Route path="forecast" element={<Forecasting />} />
            <Route path="revenue" element={<RevenueDashboard />} />
            <Route path="reports" element={<ReportBuilder />} />
            <Route path="innovation" element={<InnovationHub />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="walkthrough" element={<SolarWalkthrough />} />
            <Route path="overview" element={<ProjectOverview />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
