import { create } from "zustand";

export interface DemoUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AppState {
  isInitialized: boolean;
  setInitialized: (val: boolean) => void;
  
  // Auth state
  user: DemoUser | null;
  isAuthLoading: boolean;
  setAuth: (user: DemoUser | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  setInitialized: (val) => set({ isInitialized: val }),
  
  // Auth initial state (starts null or patient for demo)
  user: {
    id: "demo-patient",
    email: "patient@carebridge.ai",
    name: "Eleanor Vance (Patient)",
    role: "patient",
  },
  isAuthLoading: false,
  setAuth: (user) => set({ user, isAuthLoading: false }),
  setAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),
  logout: () => set({ user: null, isAuthLoading: false }),
}));
