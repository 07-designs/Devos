import { Sidebar } from "@/components/Sidebar";
import { usePlatforms, useSyncPlatform, useDeletePlatform } from "@/hooks/use-platforms";
import { StatCard } from "@/components/StatCard";
import { ConnectPlatformDialog } from "@/components/ConnectPlatformDialog";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: platforms, isLoading, error } = usePlatforms();
  const syncMutation = useSyncPlatform();
  const deleteMutation = useDeletePlatform();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="font-mono text-sm animate-pulse">INITIALIZING DASHBOARD PROTOCOLS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="md:ml-64 p-6 md:p-12 max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
          <div>
            <p className="font-mono text-xs text-primary mb-2 tracking-widest">
              USER: {user?.firstName?.toUpperCase() || "OPERATOR"} // ID: {user?.id?.slice(0, 8)}
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground uppercase glitch-text">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Center</span>
            </h2>
          </div>
          <ConnectPlatformDialog />
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "System Status", value: "ONLINE", color: "text-primary" },
            { label: "Active Nodes", value: platforms?.length || 0, color: "text-foreground" },
            { label: "Security Level", value: "MAXIMUM", color: "text-secondary" },
            { label: "Uptime", value: "99.9%", color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="bg-muted/10 border border-border p-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{stat.label}</p>
              <p className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <section>
          {error ? (
            <div className="p-6 border border-destructive/50 bg-destructive/10 flex items-center gap-4 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <p className="font-mono">CRITICAL ERROR: Failed to retrieve platform data.</p>
            </div>
          ) : platforms?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border-2 border-dashed border-border rounded-lg"
            >
              <h3 className="font-display text-2xl text-muted-foreground mb-4">NO SIGNALS DETECTED</h3>
              <p className="font-mono text-sm text-muted-foreground/50 max-w-md mx-auto mb-8">
                Your dashboard is empty. Establish connections to external platforms to begin aggregating data.
              </p>
              <ConnectPlatformDialog />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms?.map((platform) => (
                <StatCard 
                  key={platform.id}
                  platform={platform}
                  onSync={() => syncMutation.mutate(platform.id)}
                  onDelete={() => deleteMutation.mutate(platform.id)}
                  isSyncing={syncMutation.isPending && syncMutation.variables === platform.id}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === platform.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
