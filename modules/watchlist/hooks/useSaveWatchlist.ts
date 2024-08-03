import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SaveWatchlistParams, WatchlistsService } from "../services";

export const useSaveWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation<Awaited<null>, unknown, SaveWatchlistParams, unknown>({
        mutationKey: ["watchlists", "save"],
        mutationFn: WatchlistsService.saveWatchlist,
        onSuccess: async (_response, params) => {
            await queryClient.invalidateQueries({
                queryKey: ["watchlists", params.watchlistId],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: ["watchlists"],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: ["watchlists", params.watchlistId],
                exact: true,
            });
            if (params.watchlistId) {
                await queryClient.invalidateQueries({
                    queryKey: ["watchlist", params.watchlistId],
                    exact: true,
                });
            }
        },
        onError: console.warn,
    });
};
