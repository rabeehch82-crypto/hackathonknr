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
  QrCode,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      title: "PORTALS",
      items: [
        { label: "Patient Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
        { label: "Doctor Portal", href: "/doctor-dashboard", icon: Stethoscope, badge: "Clinical" },
      ],
    },
    {
      title: "ORGANIZATIONS",
      items: [
        { label: "Hospital Portal", href: "/hospital-dashboard", icon: Building2, badge: "Beds" },
        { label: "Lab Diagnostic Portal", href: "/lab-dashboard", icon: FlaskConical, badge: "OCR" },
        { label: "Pharmacy Portal", href: "/pharmacy-dashboard", icon: Pill, badge: "Supply" },
      ],
    },
    {
      title: "AI HEALTH TOOLS",
      items: [
        { label: "AI Health Assistant", href: "/ai-assistant", icon: Bot, badge: "GPT-4o" },
        { label: "Medical Reports (OCR)", href: "/medical-reports", icon: FileText, badge: "OCR" },
      ],
    },
    {
      title: "PATIENT CARE",
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
  ];

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
                          variant={item.badge === "GPT-4o" || item.badge === "OCR" ? "teal" : "outline"}
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

        {/* Emergency QR Quick Card */}
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
      </div>
    </aside>
  );
}
