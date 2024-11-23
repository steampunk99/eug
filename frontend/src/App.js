// src/components/LandingPage.js
import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SmoothScroll from "./lib/smoothSScroll";
import SchoolProfile from "./components/pages/schoolProfile";
import LoginPage from "./components/pages/Login";
import RegisterPage from "./components/pages/Register";
import ApplicationForm from "./components/pages/Application";
import SearchPage from "./components/pages/searchPage";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import SuperAdminDashboard from "./components/dashboard/super-admin/SuperAdminDashboard";
import SchoolDashboard from "./components/dashboard/school/SchoolDashboard";
import { CompareProvider } from "./context/CompareContext";
import LandingPage from "./components/pages/LandingPage";
import AddSchoolImagesForm from "./components/dashboard/AddSchoolImagesForm";
import ComparePage from "./components/pages/ComparePage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Error404 from "./components/pages/404"
import JellyFish from "./components/pages/eastereggz/404jelly"
import FractalTree404 from "./components/pages/eastereggz/404tree"
import FractalTreeBackground from "./components/pages/eastereggz/404tree2"
import DynamicBackground from "./components/pages/eastereggz/404noise"
import GoogleAuthCallback from "./components/sections/GoogleAuthCallback";      
import { authService } from "./services/authService";
import { useAuth,AuthProvider } from "./context/AuthContext";
import { useToast } from "./components/ui/use-toast";

import GoogleErrorPage from "./components/pages/GoogleErrorPage";
import CookieConsent from "./components/pages/cookie-consent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  // dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Modify the initial state to false
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  
//protected route
const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast({
      title: "Unauthorized",
      description: "You are not authorized to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  return <Element />;
};

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check for existing cookie consent
    const cookieConsent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookieConsent='));
    
    if (!cookieConsent) {
      // Add 10-second delay before showing the consent
      const timer = setTimeout(() => {
        setShowCookieConsent(true);
      }, 10000); // 10000 milliseconds = 10 seconds

      // Cleanup timer on component unmount
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
      <div className="relative">
        <SmoothScroll>
          <CompareProvider>
            <Routes>
            <Route path="*" element={<Error404 />} />
              <Route path="/jelly" element={<JellyFish />} />
              <Route path="/tree" element={<FractalTree404 />} />
              <Route path="/tree-2" element={<FractalTreeBackground />} />
              <Route path="/noise" element={<DynamicBackground />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
              <Route path="/auth/google/error" element={<GoogleErrorPage />} />
              <Route path="/addschoolimages" element={<AddSchoolImagesForm />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={({ user }) => {
                      switch (user.role) {
                        case "superadmin":
                          return <Navigate to="/dashboard/superadmin" replace />;
                        case "admin":
                          return <Navigate to="/dashboard/admin" replace />;
                        case "student":
                          return <Navigate to="/dashboard/student" replace />;
                        default:
                          return <Navigate to="/login" replace />;
                        
                      }
                    }}
                  />
                }
              />
              <Route
                path="/dashboard/superadmin/*"
                element={
                  <ProtectedRoute
                    element={SuperAdminDashboard}
                    allowedRoles={["superadmin"]}
                  />
                }
              />
              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute
                    element={SchoolDashboard}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/dashboard/student"
                element={
                  <ProtectedRoute
                    element={StudentDashboard}
                    allowedRoles={["student"]}
                  />
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
             
              <Route path="/apply/:schoolId" element={<ApplicationForm />} />
             

              <Route path="/schools/:id" element={<SchoolProfile />} />
              {/* <Route path="/schools/:schoolId/dashboard" element={<Dashboard />} /> */}
            </Routes>
            {showCookieConsent && (
              <CookieConsent
              variant="small"
                onAcceptCallback={() => {
                  setShowCookieConsent(false);
                  window.location.reload();
                }}
                onDeclineCallback={() => {
                  setShowCookieConsent(false);
                }}
              />
            )}
          </CompareProvider>
        </SmoothScroll>
      </div>
      </AuthProvider>
    </Router>
    </QueryClientProvider>
  );
};

export default App;
