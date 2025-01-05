import { useSession } from "@/modules/auth";
import type { ShowEntry } from "@/modules/showCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowWatchlist } from "../models";
import {
    type DeleteEntryRequest,
    type DeleteEntryResponse,
    ShowWatchlistService,
} from "../services";
import { ShowWatchlistKeys } from "./keys";

type Context = { previousWatchlist?: ShowWatchlist; previousEntry?: ShowEntry };

export const useDeleteShowWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteEntryResponse | null,
        unknown,
        DeleteEntryRequest,
        Context
    >({
        mutationFn: (params) =>
            ShowWatchlistService.deleteEntry({ session, ...params }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowWatchlistKeys.base,
            }),
        onMutate: ({ showId }) => {
            // Snapshot the previous value
            const previousWatchlist = queryClient.getQueryData<ShowWatchlist>(
                ShowWatchlistKeys.base,
            );

            const previousEntry = queryClient.getQueryData<ShowEntry>(
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

            queryClient.setQueryData<ShowEntry>(
                ShowWatchlistKeys.entry(params.showId),
                context.previousEntry,
            );
        },
    });
};
