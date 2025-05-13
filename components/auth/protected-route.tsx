'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authState } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if the authentication state has been initialized
    if (!authState.isLoading) {
      if (!authState.isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        // Authentication check complete
        setIsChecking(false);
      }
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  // Show loading state while checking authentication
  if (authState.isLoading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying authentication...</p>
      </div>
    );
  }

  // If authenticated, render the children
  return <>{children}</>;
}
