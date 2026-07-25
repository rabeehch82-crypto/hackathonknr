// Global TypeScript types

export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "caregiver";
}
