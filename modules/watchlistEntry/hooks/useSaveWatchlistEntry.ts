import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type SaveWatchlistEntryParams,
    WatchlistEntriesService,
} from "../services";

export const useSaveWatchlistEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<null>,
        unknown,
        SaveWatchlistEntryParams,
        unknown
    >({
        mutationKey: ["watchlistEntries", "save"],
        mutationFn: WatchlistEntriesService.saveWatchlistEntry,
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
