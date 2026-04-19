import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runEtl } from "../api/etl";

export function useEtl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runEtl,
    onSuccess: () => {
      // Invalidate all alarm and metrics caches after ETL loads new data
      queryClient.invalidateQueries({ queryKey: ["alarms"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
