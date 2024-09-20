import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type SaveWatchlistRequest,
    type SaveWatchlistResponse,
    WatchlistsService,
} from "../services";

export const useSaveWatchlist = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        SaveWatchlistResponse | null,
        unknown,
        SaveWatchlistRequest,
        unknown
    >({
        mutationKey: ["watchlists", "save"],
        mutationFn: (params) =>
            WatchlistsService.saveWatchlist({ session, ...params }),
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
