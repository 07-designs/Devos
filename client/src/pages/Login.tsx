import { useState } from "react";
import { useLocation } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { CyberInput } from "@/components/CyberInput";
import { TerminalSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegistering ? "/api/register" : "/api/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Access Granted." });
        window.location.href = "/dashboard"; // Hard reload to refresh auth state
      } else {
        const data = await res.json();
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Connection failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-primary/30 bg-black/50 p-8 rounded-lg backdrop-blur">
        <div className="flex justify-center mb-8">
          <TerminalSquare className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-display font-bold text-center mb-6 text-white">
          {isRegistering ? "INITIALIZE AGENT" : "SYSTEM LOGIN"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground">CODENAME</label>
            <CyberInput 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground">PASSPHRASE</label>
            <CyberInput 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
            />
          </div>
          <CyberButton type="submit" className="w-full mt-4">
            {isRegistering ? "REGISTER" : "ACCESS SYSTEM"}
          </CyberButton>
        </form>
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-xs font-mono text-muted-foreground hover:text-primary underline"
        >
          {isRegistering ? "Already have an ID? Login" : "Need access? Register"}
        </button>
      </div>
    </div>
  );
}