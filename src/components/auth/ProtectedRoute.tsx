import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "@/store";

export function ProtectedRoute() {
  const { user, isAuthLoading } = useAppStore();
  const location = useLocation();

  if (isAuthLoading) {
    // Render a full-screen loading state while checking auth
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
