"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";

interface LogoutLinkProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly href?: string; // Where to redirect after logout, default to /login
}

export function LogoutLink({ className = "", children, href = "/login" }: LogoutLinkProps) {
  const { logout, authState } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (isLoggingOut || !authState.isAuthenticated) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.push(href);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      asChild
      variant="ghost"
      className={className}
      disabled={isLoggingOut || !authState.isAuthenticated}
    >
      <Link
        href={href}
        onClick={handleClick}
        aria-disabled={isLoggingOut || !authState.isAuthenticated}
        tabIndex={isLoggingOut || !authState.isAuthenticated ? -1 : 0}
      >
        {isLoggingOut ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent inline-block align-middle"></span>
        ) : null}
        {children || "Logout"}
      </Link>
    </Button>
  );
}
