import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CyberButton } from "./CyberButton";
import { CyberInput } from "./CyberInput";
import { useConnectPlatform } from "@/hooks/use-platforms";
import { Plus, Github, Code, Terminal } from "lucide-react";

export function ConnectPlatformDialog() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("github");
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  
  const connect = useConnectPlatform();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connect.mutate(
      { name: platform, username, apiKey: apiKey || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setUsername("");
          setApiKey("");
        }
      }
    );
  };

  const platforms = [
    { id: "github", label: "GitHub", icon: Github },
    { id: "leetcode", label: "LeetCode", icon: Code },
    { id: "wakatime", label: "WakaTime", icon: Terminal },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CyberButton className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Connect Node
        </CyberButton>
      </DialogTrigger>
      <DialogContent className="bg-background border-primary/30 p-0 overflow-hidden sm:max-w-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
        
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-display tracking-widest text-primary uppercase">
              Establish Link
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`
                    flex flex-col items-center justify-center p-3 border font-mono text-xs uppercase transition-all duration-200
                    ${platform === p.id 
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.2)]" 
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }
                  `}
                >
                  <p.icon className="w-6 h-6 mb-2" />
                  {p.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <CyberInput
                label="Target Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                required
              />
              
              {platform === "wakatime" && (
                <CyberInput
                  label="API Key (Encrypted)"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_live_..."
                  required
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <CyberButton type="button" variant="ghost" onClick={() => setOpen(false)}>
                Abort
              </CyberButton>
              <CyberButton type="submit" isLoading={connect.isPending}>
                Initialize
              </CyberButton>
            </div>
          </form>
        </div>
        
        {/* Decorative corner accents */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
      </DialogContent>
    </Dialog>
  );
}
