import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { CyberButton } from "@/components/CyberButton";
import { CyberInput } from "@/components/CyberInput";
import { User, Shield, Key } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="md:ml-64 p-6 md:p-12 max-w-4xl mx-auto space-y-12">
        <div className="border-b border-border pb-8">
          <h2 className="text-4xl font-display font-black text-foreground uppercase mb-2">
            System <span className="text-primary">Config</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground">
            MANAGE USER PROFILE AND SECURITY PREFERENCES.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="cyber-box p-8 border border-border/50">
            <h3 className="text-xl font-display mb-6 flex items-center gap-3 text-primary">
              <User className="w-6 h-6" /> USER PROFILE
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CyberInput 
                  label="Display Name" 
                  defaultValue={`${user?.username || ''} ${user?.lastName || ''}`} 
                  disabled 
                  className="opacity-50"
      
                />
               
                <CyberInput 
                  label="Email Address" 
                  defaultValue={user?.email || ''} 
                  disabled 
                  className="opacity-50"
                />
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 bg-muted/10 border border-dashed border-border">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-4 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-display text-2xl">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <p className="font-mono text-xs text-muted-foreground uppercase">Identity Verified via Replit</p>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="cyber-box p-8 border border-border/50">
            <h3 className="text-xl font-display mb-6 flex items-center gap-3 text-secondary">
              <Shield className="w-6 h-6" /> SECURITY PROTOCOLS
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border bg-muted/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm">Two-Factor Authentication</h4>
                    <p className="font-mono text-xs text-muted-foreground">Managed by identity provider</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-mono uppercase border border-green-500/20">
                  Active
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <CyberButton variant="danger" disabled>
                  Reset All API Keys
                </CyberButton>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
