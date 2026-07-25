import { Outlet, Link, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { LayoutDashboard, Bot, Pill, FileText, Settings, ShieldAlert } from "lucide-react";

export function DashboardLayout() {
  const location = useLocation();

  const mobileTabs = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Chat", href: "/ai-assistant", icon: Bot },
    { label: "Pills", href: "/medicine-reminder", icon: Pill },
    { label: "Reports", href: "/medical-reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 sm:pb-0">
      <Navbar />
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-3 sm:px-6">
        <Sidebar />
        <main className="relative py-4 sm:py-6 lg:gap-10 lg:py-8 w-full min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Fixed Mobile Bottom Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-md px-2 py-2 flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.href;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive ? "text-teal-600 dark:text-teal-400 font-bold scale-105" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
