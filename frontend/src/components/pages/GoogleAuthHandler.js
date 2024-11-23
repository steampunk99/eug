import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GoogleAuthHandler = () => {
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        await checkAuthStatus();
        
      } catch (error) {
        console.error('Google auth handling failed:', error);
        navigate('/login');
      }
    };

    handleGoogleAuth();
  }, [checkAuthStatus, navigate]);

  return null; // Or a loading spinner component
};