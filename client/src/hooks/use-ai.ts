import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type AnalyzeProfileRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAnalyzeProfile() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeProfileRequest) => {
      const res = await fetch(api.ai.analyze.path, {
        method: api.ai.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Analysis failed");
      return api.ai.analyze.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "ANALYSIS ERROR",
        description: error.message,
        variant: "destructive",
        className: "font-mono",
      });
    },
  });
}
