import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CyberButton } from "@/components/CyberButton";
import { useAnalyzeProfile } from "@/hooks/use-ai";
import { usePlatforms } from "@/hooks/use-platforms";
import ReactMarkdown from "react-markdown";
import { Loader2, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Mirror() {
  const { data: platforms } = usePlatforms();
  const analyzeMutation = useAnalyzeProfile();
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = () => {
    analyzeMutation.mutate(
      { platformIds: platforms?.map(p => p.id) || [] },
      {
        onSuccess: (data) => {
          setAnalysis(data.analysis);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="md:ml-64 p-6 md:p-12 max-w-5xl mx-auto space-y-8">
        <div className="border-b border-border pb-8">
          <h2 className="text-4xl md:text-5xl font-display font-black text-secondary uppercase mb-2">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Mirror</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-2xl">
            AI-POWERED CAREER ANALYSIS SUBSYSTEM. INITIATE A SCAN TO RECEIVE BRUTALLY HONEST FEEDBACK ON YOUR DEVELOPER PROFILE.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="cyber-box p-6 border-l-4 border-l-secondary">
              <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-secondary" />
                SCAN PARAMETERS
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-mono text-xs border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">TARGETS</span>
                  <span className="text-primary">{platforms?.length || 0} NODES</span>
                </div>
                <div className="flex justify-between font-mono text-xs border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">MODE</span>
                  <span className="text-secondary">BRUTAL</span>
                </div>
                <div className="flex justify-between font-mono text-xs border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">ENGINE</span>
                  <span className="text-foreground">GEMINI-PRO</span>
                </div>
              </div>

              <CyberButton 
                variant="secondary" 
                className="w-full h-12" 
                onClick={handleAnalyze}
                isLoading={analyzeMutation.isPending}
                disabled={!platforms || platforms.length === 0}
              >
                {analyzeMutation.isPending ? "SCANNING..." : "INITIATE ANALYSIS"}
              </CyberButton>
            </div>

            {/* Platform Status */}
            <div className="border border-border p-4 bg-muted/5">
              <h4 className="font-mono text-xs text-muted-foreground mb-4 uppercase">Data Sources</h4>
              <div className="space-y-2">
                {platforms?.map(p => (
                  <div key={p.id} className="flex items-center gap-2 font-mono text-xs text-foreground/80">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {p.name.toUpperCase()} <span className="text-muted-foreground ml-auto">@{p.username}</span>
                  </div>
                ))}
                {(!platforms || platforms.length === 0) && (
                  <div className="text-xs font-mono text-destructive">NO DATA SOURCES FOUND</div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="lg:col-span-2">
            <div className="h-[600px] bg-black border border-border/50 relative rounded-sm overflow-hidden flex flex-col shadow-2xl">
              {/* Terminal Header */}
              <div className="h-8 bg-muted/20 border-b border-border/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <div className="ml-auto font-mono text-[10px] text-muted-foreground">output_stream.md</div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {!analysis && !analyzeMutation.isPending && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-muted-foreground/30 space-y-4"
                    >
                      <Terminal className="w-16 h-16 opacity-50" />
                      <p>WAITING FOR INPUT...</p>
                    </motion.div>
                  )}

                  {analyzeMutation.isPending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center space-y-4"
                    >
                      <Loader2 className="w-12 h-12 text-secondary animate-spin" />
                      <div className="space-y-1 text-center font-mono text-xs text-secondary">
                        <p>ESTABLISHING NEURAL LINK...</p>
                        <p className="animate-pulse">ANALYZING CODE PATTERNS...</p>
                        <p className="opacity-50">CALCULATING POTENTIAL...</p>
                      </div>
                    </motion.div>
                  )}

                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-invert prose-sm max-w-none prose-p:text-foreground/90 prose-headings:text-secondary prose-headings:font-display prose-strong:text-primary prose-code:text-accent prose-code:bg-muted/30 prose-code:px-1 prose-pre:bg-muted/20 prose-li:text-foreground/80"
                    >
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
