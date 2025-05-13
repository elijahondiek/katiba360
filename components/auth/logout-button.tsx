'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  readonly variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export function LogoutButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: LogoutButtonProps) {
  const router = useRouter();
  const { logout, authState } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Base styles for the button
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
  };
  
  // Combined styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const handleLogout = async () => {
    if (isLoggingOut || !authState.isAuthenticated) return;
    
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut || !authState.isAuthenticated}
      className={buttonStyles}
      aria-label="Logout"
    >
      {isLoggingOut ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
      ) : null}
      {children || 'Logout'}
    </button>
  );
}
