import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "@/store";

export function ProtectedRoute() {
  const { user, isAuthLoading } = useAppStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleDashboards: Record<string, string> = {
    patient: "/dashboard",
    doctor: "/doctor-dashboard",
    caregiver: "/caregiver",
    hospital: "/hospital-dashboard",
    lab: "/lab-dashboard",
    pharmacy: "/pharmacy-dashboard",
    admin: "/admin-dashboard",
  };

  const allowedRoutesPerRole: Record<string, string[]> = {
    patient: ["/dashboard", "/ai-assistant", "/medical-reports", "/appointments", "/medicine-reminder", "/caregiver", "/settings"],
    doctor: ["/doctor-dashboard", "/ai-assistant", "/medical-reports", "/appointments", "/settings"],
    caregiver: ["/caregiver", "/medicine-reminder", "/ai-assistant", "/medical-reports", "/settings"],
    hospital: ["/hospital-dashboard", "/appointments", "/medical-reports", "/settings"],
    lab: ["/lab-dashboard", "/medical-reports", "/settings"],
    pharmacy: ["/pharmacy-dashboard", "/medicine-reminder", "/settings"],
    admin: ["/admin-dashboard", "/hospital-dashboard", "/lab-dashboard", "/pharmacy-dashboard", "/settings"],
  };

  const userRole = user.role || "patient";
  const allowedRoutes = allowedRoutesPerRole[userRole] || allowedRoutesPerRole["patient"];
  const defaultDashboard = roleDashboards[userRole] || "/dashboard";

  // If user tries to access a restricted role route, redirect to their assigned dashboard
  const currentPath = location.pathname;
  if (!allowedRoutes.includes(currentPath) && currentPath !== "/") {
    return <Navigate to={defaultDashboard} replace />;
  }

  return <Outlet />;
}
