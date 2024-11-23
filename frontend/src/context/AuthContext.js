import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const clearError = () => setError(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth status check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const checkRoleAndRedirect = useCallback((userData) => {
    if (!userData || !userData.role) {
      console.error('No user data or role provided');
      navigate('/');
      return;
    }

    switch (userData.role) {
      case 'student':
        navigate('/dashboard/student');
        toast({
          title: `Welcome, ${userData.name || 'Student'}`,
          description: 'You are now logged in as a student',
        });
        break;
      case 'admin':
        navigate('/dashboard/admin');
        toast({
          title: `Welcome, ${userData.name || 'Admin'}`,
          description: 'You are now logged in as an admin',
        });
        break;
      case 'superadmin':
        navigate('/dashboard/superadmin');
        toast({
          title: `Welcome, ${userData.name || 'Super Admin'}`,
          description: 'You are now logged in as a superadmin',
        });
        break;
      default:
        navigate('/');
        toast({
          title: 'Welcome',
          description: 'Login successful',
        });
    }
  }, [navigate, toast]);

  useEffect(() => {
    const preventAuthPages = () => {
      const path = window.location.pathname;
      if (user && (path === '/login' || path === '/register')) {
        checkRoleAndRedirect(user);
      }
    };

    preventAuthPages();
  }, [user, checkRoleAndRedirect]);

  const googleLogin = async () => {
    try {
      setLoading(true);
      clearError();
      setUser(null)
      await authService.googleLogin();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Google login failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      clearError();

      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        checkRoleAndRedirect(currentUser);
        return { user: currentUser };
      }

      const data = await authService.login(credentials);
      if (data && data.user) {
        setUser(data.user);
        checkRoleAndRedirect(data.user);
        return data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      clearError();
      const data = await authService.register(userData);
      if (data && data.user) {
        setUser(data.user);
        checkRoleAndRedirect(data.user);
        return data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      clearError();
      await authService.logout();
      setUser(null);
      navigate('/login');
      toast({   
        title: 'Success',
        description: 'Logout successful',
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Logout failed',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        googleLogin,
        clearError,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};