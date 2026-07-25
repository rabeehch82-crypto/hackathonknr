import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HeartPulse,
  Bell,
  ShieldAlert,
  Sparkles,
  User,
  Stethoscope,
  Menu,
  X,
  LayoutDashboard,
  Bot,
  FileText,
  Calendar,
  Pill,
  Users,
  Settings,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"patient" | "doctor">("patient");

  const isDoctorRoute = location.pathname.includes("doctor");

  const notifications = [
    { id: 1, title: "Pill Reminder", time: "10 mins ago", desc: "Take Metformin 500mg (1 tablet)", type: "pill" },
    { id: 2, title: "Lab Report Summary", time: "1 hour ago", desc: "AI analyzed your Blood Test. All parameters normal.", type: "ai" },
    { id: 3, title: "Appointment Confirmed", time: "Yesterday", desc: "Dr. Sarah Jenkins - Tomorrow at 10:00 AM", type: "appointment" },
  ];

  const navLinks = [
    { label: "Patient Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Doctor Portal", href: "/doctor-dashboard", icon: Stethoscope },
    { label: "AI Health Assistant", href: "/ai-assistant", icon: Bot },
    { label: "Medical Reports (OCR)", href: "/medical-reports", icon: FileText },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Pill Reminders", href: "/medicine-reminder", icon: Pill },
    { label: "Caregiver Network", href: "/caregiver", icon: Users },
    { label: "Settings & Emergency QR", href: "/settings", icon: Settings },
  ];

  const handleRoleToggle = (role: "patient" | "doctor") => {
    setActiveRole(role);
    setMobileMenuOpen(false);
    if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-6">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger Button for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-xl h-10 w-10 text-foreground"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 text-white shadow-md shadow-teal-500/20 shrink-0">
                <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg leading-none tracking-tight text-foreground flex items-center gap-1">
                  CareBridge <span className="gradient-heading">AI</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground tracking-wider uppercase hidden xs:inline">
                  Healthcare Intelligence
                </span>
              </div>
            </Link>

            {/* AI Online Pill Badge (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5 text-teal-500 animate-spin" style={{ animationDuration: "6s" }} />
              <span>AI Engine Active</span>
            </div>
          </div>

          {/* Quick Actions & Nav */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Demo Role Switcher (Desktop) */}
            <div className="hidden sm:flex items-center rounded-xl bg-muted/80 p-1 border">
              <button
                onClick={() => handleRoleToggle("patient")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  !isDoctorRoute && activeRole === "patient"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                Patient
              </button>
              <button
                onClick={() => handleRoleToggle("doctor")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isDoctorRoute || activeRole === "doctor"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5" />
                Doctor Portal
              </button>
            </div>

            {/* Emergency SOS Button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEmergencyModal(true)}
              className="pulse-emergency font-bold shadow-md gap-1 sm:gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-2.5 sm:px-3 text-xs"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>SOS</span>
            </Button>

            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl hover:bg-muted h-9 w-9"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
              </Button>

              {/* Notification Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl border bg-card p-4 shadow-xl glass-card z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <Badge variant="teal">3 Unread</Badge>
                  </div>
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-3 flex gap-3 hover:bg-muted/40 p-2 rounded-xl transition-colors cursor-pointer">
                        <div className="h-2 w-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-muted-foreground/70 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account Login Button */}
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 hidden sm:flex border-border text-xs">
                <User className="h-3.5 w-3.5 text-teal-600" />
                <span>Log In</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-card/95 backdrop-blur-md p-4 space-y-4 animate-in slide-in-from-top duration-200">
            {/* Mobile Role Switcher */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 border text-xs font-semibold">
              <button
                onClick={() => handleRoleToggle("patient")}
                className={`py-2 rounded-lg transition-all ${
                  !isDoctorRoute && activeRole === "patient" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Patient Dashboard
              </button>
              <button
                onClick={() => handleRoleToggle("doctor")}
                className={`py-2 rounded-lg transition-all ${
                  isDoctorRoute || activeRole === "doctor" ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground"
                }`}
              >
                Doctor Portal
              </button>
            </div>

            {/* Links list */}
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-teal-500/15 text-teal-700 dark:text-teal-300"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-teal-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Emergency SOS Modal */}
      <Modal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        title="🚨 EMERGENCY SOS ACTIVATED"
        description="Immediate medical dispatch and caregiver notification setup."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm font-medium leading-relaxed">
            Sending critical alert with your GPS location, Blood Group (O+), and Medical QR ID to assigned caregivers & emergency services.
          </div>
          <div className="flex flex-col gap-2">
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 text-base rounded-xl gap-2 shadow-lg shadow-rose-600/20">
              <ShieldAlert className="h-5 w-5" />
              Call 911 / Emergency Services Now
            </Button>
            <Link to="/settings" onClick={() => setShowEmergencyModal(false)}>
              <Button variant="outline" className="w-full h-11 rounded-xl">
                Show Emergency QR Card
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
