import { CyberButton } from "@/components/CyberButton";
import { TerminalSquare, ChevronRight, Github, Code, BarChart3, BrainCircuit } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  // const handleLogin = () => {
  //   window.location.href = "/api/login";
  // };
  const [, setLocation] = useLocation();
  
  const handleLogin = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,19,0.9),rgba(18,16,19,0.9)),url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="font-display font-bold text-2xl tracking-widest">DEV<span className="text-primary">OS</span></h1>
        </div>
        <CyberButton onClick={handleLogin} variant="primary">Initialize System</CyberButton>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              System v2.0 Online
            </div>
            
            <h2 className="text-5xl md:text-7xl font-display font-black leading-tight uppercase">
              The Unified <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">Command Center</span>
              <br/> For Developers
            </h2>
            
            <p className="text-lg text-muted-foreground font-mono max-w-xl leading-relaxed">
              Aggregate your existence. Track stats from GitHub, LeetCode, and WakaTime in one cyberpunk dashboard. 
              Let our Brutal AI analyze your career trajectory.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <CyberButton onClick={handleLogin} className="h-14 px-8 text-lg">
                Enter The Void <ChevronRight className="ml-2 w-5 h-5" />
              </CyberButton>
              <CyberButton variant="ghost" className="h-14 px-8 text-lg border-white/20">
                View Demo
              </CyberButton>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse" />
            <div className="relative bg-black/80 border border-primary/30 p-2 rounded-lg backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-auto font-mono text-xs text-muted-foreground">dashboard.tsx</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded">
                  <Github className="w-8 h-8 text-primary mb-2" />
                  <div className="h-2 w-20 bg-primary/20 rounded mb-2" />
                  <div className="h-2 w-12 bg-primary/20 rounded" />
                </div>
                <div className="bg-secondary/5 border border-secondary/20 p-4 rounded">
                  <BrainCircuit className="w-8 h-8 text-secondary mb-2" />
                  <div className="h-2 w-20 bg-secondary/20 rounded mb-2" />
                  <div className="h-2 w-12 bg-secondary/20 rounded" />
                </div>
                <div className="col-span-2 bg-muted/10 border border-white/10 p-4 rounded">
                  <div className="flex justify-between items-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                    <span className="text-xs font-mono text-green-400">+24% PRODUCTIVITY</span>
                  </div>
                  <div className="h-32 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 85, 95].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 rounded-t" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Code, 
                title: "Unified Stats", 
                desc: "Merge data from every platform you code on. No more fragmented profiles." 
              },
              { 
                icon: BrainCircuit, 
                title: "AI Analysis", 
                desc: "Get brutally honest feedback on your code and career from our AI engine." 
              },
              { 
                icon: TerminalSquare, 
                title: "Cyber Aesthetics", 
                desc: "A dashboard that looks like it belongs in 2077. Pure visual dopamine." 
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-white/10 hover:border-primary/50 transition-colors bg-white/5 hover:bg-white/10 group">
                <feature.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
