import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitorCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getVisitorCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePfpCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["pfpCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getPfpCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterVisit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.registerVisit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitorCount"] });
    },
  });
}

export function useRegisterPfp() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.registerPfp();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pfpCount"] });
    },
  });
}
