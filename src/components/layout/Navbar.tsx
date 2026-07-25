import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HeartPulse,
  Bell,
  ShieldAlert,
  User,
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
  Users,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/store";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleMeta: Record<string, { label: string; icon: any; badge: string }> = {
    patient: { label: "Patient Portal", icon: User, badge: "Patient" },
    doctor: { label: "Doctor Portal", icon: Stethoscope, badge: "Clinical Doctor" },
    caregiver: { label: "Caregiver Portal", icon: Users, badge: "Caregiver" },
    hospital: { label: "Hospital Portal", icon: Building2, badge: "Hospital Admin" },
    lab: { label: "Lab Diagnostic Portal", icon: FlaskConical, badge: "Lab Tech" },
    pharmacy: { label: "Pharmacy Portal", icon: Pill, badge: "Pharmacist" },
    admin: { label: "Super Admin Panel", icon: ShieldCheck, badge: "Super Admin" },
  };

  const currentRole = user?.role || "patient";
  const activeMeta = roleMeta[currentRole] || roleMeta["patient"];
  const RoleIcon = activeMeta.icon;

  const notifications = [
    { id: 1, title: "Pill Reminder", time: "10 mins ago", desc: "Take Metformin 500mg (1 tablet)", type: "pill" },
    { id: 2, title: "Lab Report Summary", time: "1 hour ago", desc: "AI analyzed your Blood Test. All parameters normal.", type: "ai" },
    { id: 3, title: "Appointment Confirmed", time: "Yesterday", desc: "Dr. Sarah Jenkins - Tomorrow at 10:00 AM", type: "appointment" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-6">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
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
          </div>

          {/* Locked Active Role & Profile Information */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-200 text-xs font-semibold">
                <RoleIcon className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="hidden sm:inline font-bold">{user.name || activeMeta.label}</span>
                <Badge variant="teal" className="text-[10px] px-1.5 py-0">
                  {activeMeta.badge}
                </Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 ml-1 bg-background/50 px-1.5 py-0.5 rounded-md border">
                  <Lock className="h-2.5 w-2.5" /> Locked
                </span>
              </div>
            ) : null}

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

            {/* Log Out / Log In */}
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="rounded-xl gap-1.5 flex border-border text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 flex border-border text-xs">
                  <User className="h-3.5 w-3.5 text-teal-600" />
                  <span>Log In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
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
