// Main App component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { MapPage } from '@/pages/MapPage';
import { AppProvider, useAppStore } from '@/store';
import { LoadingSpinner } from '@/components/ui';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAppStore();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAppStore();
  
  if (auth.isAuthenticated) {
    return <Navigate to="/map" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { auth } = useAppStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  // Initialize app and check authentication
  React.useEffect(() => {
    // Simulate a brief initialization period
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative">
        {auth.isLoading && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        )}
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <Navigate
                to={auth.isAuthenticated ? '/map' : '/login'}
                replace
              />
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={auth.isAuthenticated ? '/map' : '/login'}
                replace
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};
