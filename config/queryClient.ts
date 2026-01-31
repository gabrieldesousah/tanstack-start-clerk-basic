import { QueryClient } from "@tanstack/react-query";

import { FIFTEEN_MINUTES, FIVE_MINUTES } from "./constants";

/**
 * Configurações padrões do ReactQuery.
 * Se aplica à todas as requests a não ser que seja sobrescrito
 * na própria request.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Não refazer request quando component montar
      refetchOnMount: false,
      refetchOnWindowFocus: false, // This disables automatic refetching on window focus
      // Tempo de cache
      gcTime: FIVE_MINUTES,
      // Tempo até uma request ser considerada "antiga" (stale)
      staleTime: FIFTEEN_MINUTES,
    },
  },
});
