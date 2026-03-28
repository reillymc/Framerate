import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";
import type {
    DeleteResponse,
    ShowWatchlistApiDeleteEntryRequest,
} from "@/services";

import type { ShowWatchlist, ShowWatchlistEntry } from "../models";
import { ShowWatchlistKeys } from "./keys";

type Context = {
    previousWatchlist?: ShowWatchlist;
    previousEntry?: ShowWatchlistEntry;
};

export const useDeleteShowWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { showWatchlist } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        ShowWatchlistApiDeleteEntryRequest,
        Context
    >({
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: (params) => showWatchlist!.deleteEntry(params),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowWatchlistKeys.base,
            }),
        onMutate: ({ showId }) => {
            // Snapshot the previous value
            const previousWatchlist = queryClient.getQueryData<ShowWatchlist>(
                ShowWatchlistKeys.base,
            );

            const previousEntry = queryClient.getQueryData<ShowWatchlistEntry>(
                ShowWatchlistKeys.entry(showId),
            );

            // Optimistically delete the entry
            if (previousWatchlist?.entries) {
                queryClient.setQueryData<ShowWatchlist>(
                    ShowWatchlistKeys.base,
                    {
                        ...previousWatchlist,
                        entries: previousWatchlist.entries.filter(
                            (show) => show.showId !== showId,
                        ),
                    },
                );
            }

            queryClient.setQueryData(ShowWatchlistKeys.entry(showId), null);

            // Return snapshot so we can rollback in case of failure
            return { previousWatchlist, previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<ShowWatchlist>(
                ShowWatchlistKeys.base,
                context.previousWatchlist,
            );

            queryClient.setQueryData<ShowWatchlistEntry>(
                ShowWatchlistKeys.entry(params.showId),
                context.previousEntry,
            );
        },
    });
};
