import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type DeleteWatchlistEntryParams,
    WatchlistEntriesService,
} from "../services";

export const useDeleteWatchlistEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<null>,
        unknown,
        DeleteWatchlistEntryParams,
        unknown
    >({
        mutationKey: ["watchlistEntries", "delete"],
        mutationFn: WatchlistEntriesService.deleteWatchlistEntry,
        onSuccess: async (_response, params) => {
            await queryClient.invalidateQueries({
                queryKey: ["watchlistEntries", params.mediaType],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: [
                    "watchlistEntries",
                    params.mediaType,
                    params.mediaId,
                ],
                exact: true,
            });
        },
        onError: console.warn,
    });
};
