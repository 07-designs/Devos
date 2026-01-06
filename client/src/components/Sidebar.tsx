import { Link, useLocation } from "wouter";
import { LayoutDashboard, BrainCircuit, Settings, LogOut, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
    { href: "/mirror", label: "The Mirror", icon: BrainCircuit },
    { href: "/settings", label: "System Config", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-background/50 hidden md:flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <TerminalSquare className="w-8 h-8 text-primary" />
          <div>
            <h1 className="font-display font-bold text-xl tracking-widest text-foreground">DEV<span className="text-primary">OS</span></h1>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">v2.0.77 RELEASE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-none border-l-2 cursor-pointer transition-all duration-300 group font-mono text-sm uppercase tracking-wide",
              location === item.href 
                ? "border-primary bg-primary/5 text-primary shadow-[inset_10px_0_20px_-10px_hsl(var(--primary)/0.2)]" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10 hover:border-muted-foreground/50"
            )}>
              <item.icon className={cn("w-5 h-5", location === item.href && "animate-pulse")} />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full text-left font-mono text-sm text-destructive hover:bg-destructive/10 hover:text-destructive-foreground transition-all duration-300 uppercase tracking-wide border border-transparent hover:border-destructive"
        >
          <LogOut className="w-5 h-5" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
