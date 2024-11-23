import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = authService;

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get session ID from URL if needed
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('sessionId');
        
        console.log('Session established:', sessionId);

        // Get user data using the session
        const userData = await authService.getCurrentUser();
        
        if (!userData) {
          console.error('No user data received');
          navigate('/login?error=auth-failed');
          return;
        }

        // Redirect based on user role
        const userRole = userData?.role || 'student';
        const dashboardPath = userRole === 'admin' ? '/dashboard/admin' : userRole === 'superadmin' ? '/dashboard/superadmin' : '/dashboard/student';
        
        navigate(dashboardPath);
      } catch (error) {
        console.error('Google auth callback error:', error);
        navigate('/login?error=' + encodeURIComponent(error.message));
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  useEffect(() => {
    // Call login function to complete authentication
    login();
  }, [login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="mt-4">Completing authentication...</p>
    </div>
  );
};

export default GoogleAuthCallback;