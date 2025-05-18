'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

interface ProtectedLayoutProps {
  readonly children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
