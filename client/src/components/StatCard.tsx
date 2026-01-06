import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RefreshCw, Trash2, ExternalLink } from "lucide-react";
import { CyberButton } from "./CyberButton";
import { Platform } from "@shared/schema";

interface StatCardProps {
  platform: Platform;
  onSync: () => void;
  onDelete: () => void;
  isSyncing: boolean;
  isDeleting: boolean;
}

export function StatCard({ platform, onSync, onDelete, isSyncing, isDeleting }: StatCardProps) {
  const stats = platform.stats as Record<string, any>;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-box p-6 flex flex-col justify-between h-full min-h-[240px] border border-primary/20 hover:border-primary/50 transition-colors group"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-display font-bold uppercase text-foreground tracking-widest flex items-center gap-2">
            {platform.name}
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_hsl(150_100%_50%)]"></span>
          </h3>
          <p className="text-xs font-mono text-muted-foreground mt-1">@{platform.username}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className="p-2 text-primary hover:bg-primary/10 rounded disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
          </button>
          <button 
            onClick={onDelete}
            disabled={isDeleting}
            className="p-2 text-destructive hover:bg-destructive/10 rounded disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Display - Dynamic based on platform */}
      <div className="flex-1 space-y-4 font-mono text-sm">
        {Object.entries(stats).length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats).slice(0, 4).map(([key, value]) => (
              <div key={key} className="bg-muted/20 p-2 border-l-2 border-primary/50">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">{key.replace(/_/g, ' ')}</p>
                <p className="text-lg font-bold text-foreground truncate">{String(value)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground italic text-xs">
            No stats synced yet. <br/>Initiate sequence...
          </div>
        )}
      </div>

      {/* Footer / Last Updated */}
      <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
        <span>Updated: {platform.lastUpdated ? new Date(platform.lastUpdated).toLocaleDateString() : 'Never'}</span>
        <ExternalLink className="w-3 h-3 hover:text-primary cursor-pointer" />
      </div>
    </motion.div>
  );
}
