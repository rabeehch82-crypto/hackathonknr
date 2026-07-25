import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  FileText,
  Calendar,
  Pill,
  Users,
  Settings,
  Stethoscope,
  Building2,
  FlaskConical,
  ShieldCheck,
  QrCode,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store";

export function Sidebar() {
  const location = useLocation();
  const { user } = useAppStore();

  const activeRole = user?.role || "patient";

  // Navigation Items defined specifically per role
  const roleNavItems: Record<string, { title: string; items: { label: string; href: string; icon: any; badge?: string | null }[] }[]> = {
    patient: [
      {
        title: "PATIENT PORTAL",
        items: [
          { label: "My Health Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: "Live" },
        ],
      },
      {
        title: "AI HEALTH ASSISTANT",
        items: [
          { label: "AI Health Assistant", href: "/ai-assistant", icon: Bot, badge: "GPT-4o" },
          { label: "Medical Reports (OCR)", href: "/medical-reports", icon: FileText, badge: "OCR" },
        ],
      },
      {
        title: "CARE & REMINDERS",
        items: [
          { label: "Appointments", href: "/appointments", icon: Calendar, badge: null },
          { label: "Pill & Reminders", href: "/medicine-reminder", icon: Pill, badge: "2 Pending" },
          { label: "Caregiver Network", href: "/caregiver", icon: Users, badge: null },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "Settings & Emergency QR", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],

    doctor: [
      {
        title: "DOCTOR PORTAL",
        items: [
          { label: "Clinical Dashboard", href: "/doctor-dashboard", icon: Stethoscope, badge: "Clinical" },
        ],
      },
      {
        title: "PATIENT CARE & AI",
        items: [
          { label: "Patient Appointments", href: "/appointments", icon: Calendar, badge: null },
          { label: "AI Diagnostics Assistant", href: "/ai-assistant", icon: Bot, badge: "GPT-4o" },
          { label: "Medical Reports (OCR)", href: "/medical-reports", icon: FileText, badge: "OCR" },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "Settings & Profile", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],

    caregiver: [
      {
        title: "CAREGIVER PORTAL",
        items: [
          { label: "Caregiver Dashboard", href: "/caregiver", icon: Users, badge: "Family" },
        ],
      },
      {
        title: "PATIENT MONITORING",
        items: [
          { label: "Pill & Medication Track", href: "/medicine-reminder", icon: Pill, badge: "Active" },
          { label: "AI Health Assistant", href: "/ai-assistant", icon: Bot, badge: "GPT-4o" },
          { label: "Medical Reports", href: "/medical-reports", icon: FileText, badge: null },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "Settings & QR Card", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],

    hospital: [
      {
        title: "HOSPITAL PORTAL",
        items: [
          { label: "Hospital Dashboard", href: "/hospital-dashboard", icon: Building2, badge: "Beds" },
        ],
      },
      {
        title: "OPERATIONS",
        items: [
          { label: "Admissions & Schedule", href: "/appointments", icon: Calendar, badge: null },
          { label: "Medical Records", href: "/medical-reports", icon: FileText, badge: null },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "Hospital Settings", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],

    lab: [
      {
        title: "LAB DIAGNOSTICS",
        items: [
          { label: "Lab Diagnostic Portal", href: "/lab-dashboard", icon: FlaskConical, badge: "Diagnostic" },
        ],
      },
      {
        title: "OCR & REPORT ANALYZER",
        items: [
          { label: "Medical Reports (OCR)", href: "/medical-reports", icon: FileText, badge: "OCR AI" },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "Lab Settings", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],

    pharmacy: [
      {
        title: "PHARMACY DISPENSING",
        items: [
          { label: "Pharmacy Portal", href: "/pharmacy-dashboard", icon: Pill, badge: "Rx Supply" },
        ],
      },
      {
        title: "PRESCRIPTION MANAGEMENT",
        items: [
          { label: "Medication Reminders", href: "/medicine-reminder", icon: Pill, badge: null },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "Pharmacy Settings", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],

    admin: [
      {
        title: "SUPER ADMIN",
        items: [
          { label: "Super Admin Panel", href: "/admin-dashboard", icon: ShieldCheck, badge: "Master" },
        ],
      },
      {
        title: "NETWORK PORTALS",
        items: [
          { label: "Hospital Verification", href: "/hospital-dashboard", icon: Building2, badge: null },
          { label: "Lab Verification", href: "/lab-dashboard", icon: FlaskConical, badge: null },
          { label: "Pharmacy Network", href: "/pharmacy-dashboard", icon: Pill, badge: null },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { label: "System Settings", href: "/settings", icon: Settings, badge: null },
        ],
      },
    ],
  };

  const navItems = roleNavItems[activeRole] || roleNavItems["patient"];

  return (
    <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block md:w-64 border-r bg-sidebar/50 backdrop-blur-sm">
      <div className="flex flex-col h-full justify-between py-6 px-3">
        <div className="space-y-5 overflow-y-auto pr-1">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all group",
                        isActive
                          ? "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold shadow-xs"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform group-hover:scale-110",
                            isActive ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "GPT-4o" || item.badge === "Master" ? "teal" : "outline"}
                          className="text-[9px] px-1.5 py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency QR Quick Card - Exclusively for Patients */}
        {activeRole === "patient" && (
          <div className="p-2 pt-0">
            <Link
              to="/settings"
              className="flex items-center gap-2.5 p-2.5 rounded-2xl border bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-transparent hover:border-teal-500/40 transition-all group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <QrCode className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-foreground flex items-center gap-1">
                  Medical QR ID
                  <Sparkles className="h-3 w-3 text-teal-500" />
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  Scan for Instant Records
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
