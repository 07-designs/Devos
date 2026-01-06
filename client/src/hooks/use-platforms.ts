import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertPlatform, type Platform } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch all connected platforms
export function usePlatforms() {
  return useQuery({
    queryKey: [api.platforms.list.path],
    queryFn: async () => {
      const res = await fetch(api.platforms.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch platforms");
      // Validate with Zod schema from routes
      return api.platforms.list.responses[200].parse(await res.json());
    },
  });
}

// Connect a new platform
export function useConnectPlatform() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPlatform & { apiKey?: string }) => {
      // Validate input before sending (extra safety)
      const validated = api.platforms.connect.input.parse(data);
      
      const res = await fetch(api.platforms.connect.path, {
        method: api.platforms.connect.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.platforms.connect.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to connect platform");
      }
      
      return api.platforms.connect.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.platforms.list.path] });
      toast({
        title: "LINK ESTABLISHED",
        description: "Platform connected successfully.",
        className: "border-primary text-primary font-mono",
      });
    },
    onError: (error) => {
      toast({
        title: "CONNECTION ERROR",
        description: error.message,
        variant: "destructive",
        className: "font-mono",
      });
    },
  });
}

// Delete a platform
export function useDeletePlatform() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.platforms.delete.path, { id });
      const res = await fetch(url, {
        method: api.platforms.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to disconnect platform");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.platforms.list.path] });
      toast({
        title: "LINK SEVERED",
        description: "Platform disconnected.",
        className: "border-destructive text-destructive font-mono",
      });
    },
  });
}

// Sync platform stats
export function useSyncPlatform() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.platforms.sync.path, { id });
      const res = await fetch(url, {
        method: api.platforms.sync.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to sync platform");
      return api.platforms.sync.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.platforms.list.path] });
      toast({
        title: "DATA SYNC COMPLETE",
        description: "Latest stats retrieved.",
        className: "border-primary text-primary font-mono",
      });
    },
  });
}
