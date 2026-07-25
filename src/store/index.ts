import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";

interface AppState {
  isInitialized: boolean;
  setInitialized: (val: boolean) => void;
  
  // Auth state
  session: Session | null;
  user: User | null;
  isAuthLoading: boolean;
  setAuth: (session: Session | null, user: User | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  setInitialized: (val) => set({ isInitialized: val }),
  
  // Auth initial state
  session: null,
  user: null,
  isAuthLoading: true,
  setAuth: (session, user) => set({ session, user, isAuthLoading: false }),
  setAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),
}));
