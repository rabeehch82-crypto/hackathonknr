import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setAuthLoading } = useAppStore();
  const supabase = createClient();

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        setAuth(session, session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setAuthLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuth(session, session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setAuthLoading, supabase.auth]);

  return <>{children}</>;
}
