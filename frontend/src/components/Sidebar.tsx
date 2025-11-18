import { LayoutGrid, Wallet, Receipt, HandCoins, TrendingUp, BarChart3, PieChart, FileText, MessageSquare, Settings, MessageCircle, HelpCircle, Moon, Sun, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type MenuItem = {
  icon: any;
  label: string;
  path?: string;
  action?: () => void;
  badge?: number;
};

const menuItems: MenuItem[] = [
  { icon: LayoutGrid, label: "Overview", path: "/" },
  { icon: Receipt, label: "Transaction", path: "/transactions" },
  { icon: Tag, label: "Categories", path: "/categories" },
  { icon: TrendingUp, label: "Market Insights", path: "/insights" },
];

const settingsItems: MenuItem[] = [
  { icon: Settings, label: "Settings" },
  { icon: MessageCircle, label: "Feedback" },
  { icon: HelpCircle, label: "Help & Center" },
];

export function Sidebar() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Apply dark mode on mount and when toggled
  useState(() => {
    document.documentElement.classList.add('dark');
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col p-6">
      <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">D</span>
        </div>
        <span className="font-bold text-xl">DellFin</span>
      </div>

      <div className="mb-8">
        <p className="text-xs text-muted-foreground mb-4 font-medium">Menu</p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors relative",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/70 hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <p className="text-xs text-muted-foreground mb-4 font-medium">Help & Settings</p>
        <nav className="space-y-1 mb-6">
          {settingsItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground/70 hover:bg-secondary transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-between px-4">
          <span className="text-sm text-foreground/70">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className="w-12 h-6 bg-secondary rounded-full relative transition-colors"
          >
            <div className={cn(
              "w-5 h-5 bg-card rounded-full absolute top-0.5 transition-all shadow-sm flex items-center justify-center",
              darkMode ? "left-6" : "left-0.5"
            )}>
              {darkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
