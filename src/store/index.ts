import { create } from "zustand";

export interface DemoUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
];

interface AppState {
  isInitialized: boolean;
  setInitialized: (val: boolean) => void;
  
  // Auth state
  user: DemoUser | null;
  isAuthLoading: boolean;
  setAuth: (user: DemoUser | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  logout: () => void;

  // Language state
  language: string;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isInitialized: false,
  setInitialized: (val) => set({ isInitialized: val }),
  
  // Auth initial state
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

  // Language initial state
  language: "en",
  setLanguage: (language) => set({ language }),
}));
