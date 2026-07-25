import { Link } from "react-router-dom";
import { Home, LayoutDashboard, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block md:w-64 border-r">
      <div className="h-full py-6 pr-6 lg:py-8">
        <div className="flex flex-col space-y-4 px-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center space-x-2 text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
