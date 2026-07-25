import React, { useEffect } from "react";
import { useAppStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setInitialized, setAuthLoading } = useAppStore();

  useEffect(() => {
    setAuthLoading(false);
    setInitialized(true);
  }, [setAuthLoading, setInitialized]);

  return <>{children}</>;
}
