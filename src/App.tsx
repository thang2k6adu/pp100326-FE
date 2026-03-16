import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './hooks/useTheme';

// Lazy load pages
const Login = React.lazy(() => import('@/pages/Login'));
const SignUp = React.lazy(() => import('@/pages/SignUp'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const Projects = React.lazy(() => import('@/pages/Projects'));
const ProjectDetail = React.lazy(() => import('@/pages/ProjectDetail'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { theme } = useTheme();

  return (
    <>
      <Helmet>
        <html lang="en" className={theme} />
      </Helmet>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              path="projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
