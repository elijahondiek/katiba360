'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import Cookies from 'js-cookie'; // Added for setting cookies after login


// Define user type based on the API response
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  avatar_url?: string;
  display_name?: string;
  auth_provider: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Define auth state
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Define auth context props
interface AuthContextProps {
  authState: AuthState;
  login: (code: string, redirectUri: string, state?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create auth provider
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  
  // Initialize auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  // Load auth state from local storage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        if (storedUser && storedAccessToken) {
          setAuthState({
            user: JSON.parse(storedUser),
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState(prevState => ({
            ...prevState,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };
    
    loadAuthState();
  }, []);
  
  // Create a ref to track login attempts outside the login function
  const lastLoginKeyRef = React.useRef<string | null>(null);
  
  // Login with Google OAuth
  const login = async (code: string, redirectUri: string, state?: string) => {
    // Prevent multiple calls with the same parameters
    const loginKey = `${code}-${redirectUri}-${state || ''}`;
    
    if (lastLoginKeyRef.current === loginKey) {
      // console.log('Preventing duplicate login attempt');
      return;
    }
    
    lastLoginKeyRef.current = loginKey;
    
    try {
      // Only set loading state if we're not already authenticated
      if (!authState.isAuthenticated) {
        setAuthState(prevState => ({
          ...prevState,
          isLoading: true,
        }));
      }
      
      // console.log('Exchanging code for tokens...');
      const response = await fetchAPI('/api/v1/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          code,
          redirect_uri: redirectUri,
          state,
        }),
      });
      
      // console.log('Response received:', response);
      
      if (response.body) {
        const { access_token, refresh_token, user } = response.body;
        
        // Save auth state to local storage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        // Set accessToken as cookie for middleware detection
        // This enables server-side middleware to recognize authentication
        Cookies.set('accessToken', access_token, {
          path: '/',
          // secure: process.env.NODE_ENV === 'production',
          // sameSite: 'lax',
          // expires: 7, // 7 days
        });
        
        // Update auth state
        setAuthState({
          user,
          accessToken: access_token,
          refreshToken: refresh_token,
          isLoading: false,
          isAuthenticated: true,
        });
        
        // Use a timeout to avoid state update conflicts
        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
      }));
      
      // Use a timeout to avoid state update conflicts
      setTimeout(() => {
        router.push('/login?error=auth_failed');
      }, 100);
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      // Only attempt to call the API if we have an access token
      if (authState.isAuthenticated && authState.accessToken) {
        try {
          // First, try the local API route which handles token revocation
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authState.accessToken}`,
            },
          });
          
          // console.log('Successfully logged out on server');
        } catch (apiError) {
          // If the API call fails, log the error but continue with local logout
          console.error('Error calling logout API:', apiError);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state regardless of API call result
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Remove accessToken cookie for middleware logout
      Cookies.remove('accessToken', { path: '/' });
      
      // Update auth state
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      // console.log('Local logout completed');
    }
  };
  
  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      if (!authState.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetchAPI('/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: authState.refreshToken,
        }),
      });
      
      if (response.body) {
        const { access_token, refresh_token } = response.body;
        
        // Update tokens in local storage
        localStorage.setItem('accessToken', access_token);
        if (refresh_token) {
          localStorage.setItem('refreshToken', refresh_token);
        }
        
        // Update auth state
        setAuthState(prevState => ({
          ...prevState,
          accessToken: access_token,
          refreshToken: refresh_token || prevState.refreshToken,
        }));
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // If refresh fails, log out the user
      await logout();
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
