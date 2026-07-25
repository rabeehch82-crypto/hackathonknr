"use client";

import { useEffect, useState } from "react";
import AppRouter from "@/Router";
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function CatchAllRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
