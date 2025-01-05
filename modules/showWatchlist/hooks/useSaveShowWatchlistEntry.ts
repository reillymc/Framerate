import { useSession } from "@/modules/auth";
import type { Show } from "@/modules/show";
import { ShowKeys } from "@/modules/show/hooks/keys";
import type { ShowEntry } from "@/modules/showCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowWatchlist } from "../models";
import { type SaveEntryRequest, ShowWatchlistService } from "../services";
import { ShowWatchlistKeys } from "./keys";

type Context = { previousWatchlist?: ShowWatchlist; previousEntry?: ShowEntry };

export const useSaveShowWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<ShowEntry | null, unknown, SaveEntryRequest, Context>({
        mutationFn: (params) =>
            ShowWatchlistService.saveEntry({ session, ...params }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({ queryKey: ShowWatchlistKeys.base }),
        onMutate: ({ showId }) => {
            // Snapshot the previous value
            const previousWatchlist = queryClient.getQueryData<ShowWatchlist>(
                ShowWatchlistKeys.base,
            );

            const previousEntry = queryClient.getQueryData<ShowEntry>(
                ShowWatchlistKeys.entry(showId),
            );

            let showDetails = queryClient.getQueryData<Show>(
                ShowKeys.details(showId),
            );

            if (!showDetails) {
                showDetails = queryClient
                    .getQueryData<Show[]>(ShowKeys.popular())
                    ?.find(({ id }) => id === showId);
            }

            const newEntry = {
                ...showDetails,
                showId,
                name: showDetails?.name ?? "Loading...",
            } satisfies ShowEntry;

            // Optimistically update to the new value
            if (previousWatchlist) {
                queryClient.setQueryData<ShowWatchlist>(
                    ShowWatchlistKeys.base,
                    {
                        ...previousWatchlist,
                        entries: [
                            ...(previousWatchlist.entries ?? []),
                            newEntry,
                        ],
                    },
                );
            }

            queryClient.setQueryData<ShowEntry>(
                ShowWatchlistKeys.entry(showId),
                newEntry,
            );

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
