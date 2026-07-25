import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { DashboardLayout } from "./views/layout/DashboardLayout";

// Pages
import { LandingPage } from "./views/LandingPage";
import { LoginPage } from "./views/auth/LoginPage";
import { RegisterPage } from "./views/auth/RegisterPage";
import { DashboardPage } from "./views/dashboard/DashboardPage";
import { AIAssistantPage } from "./views/dashboard/AIAssistantPage";
import { MedicalReportsPage } from "./views/dashboard/MedicalReportsPage";
import { AppointmentsPage } from "./views/dashboard/AppointmentsPage";
import { MedicineReminderPage } from "./views/dashboard/MedicineReminderPage";
import { CaregiverPage } from "./views/dashboard/CaregiverPage";
import { DoctorDashboardPage } from "./views/dashboard/DoctorDashboardPage";
import { HospitalDashboardPage } from "./views/dashboard/HospitalDashboardPage";
import { LabDashboardPage } from "./views/dashboard/LabDashboardPage";
import { PharmacyDashboardPage } from "./views/dashboard/PharmacyDashboardPage";
import { SettingsPage } from "./views/dashboard/SettingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes with Shared Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboardPage />} />
          <Route path="/lab-dashboard" element={<LabDashboardPage />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboardPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/medical-reports" element={<MedicalReportsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/medicine-reminder" element={<MedicineReminderPage />} />
          <Route path="/caregiver" element={<CaregiverPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
