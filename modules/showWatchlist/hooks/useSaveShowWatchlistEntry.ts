import { useFramerateServices } from "@/hooks";
import type { Show } from "@/modules/show";
import { ShowKeys } from "@/modules/show/hooks/keys";
import type { ShowWatchlistApiCreateEntryRequest } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowWatchlist, ShowWatchlistEntry } from "../models";
import { ShowWatchlistKeys } from "./keys";

type Context = {
    previousWatchlist?: ShowWatchlist;
    previousEntry?: ShowWatchlistEntry;
};

type ShowWatchlistEntrySaveRequest =
    ShowWatchlistApiCreateEntryRequest["saveShowWatchlistEntryRequest"];

export const useSaveShowWatchlistEntry = () => {
    const queryClient = useQueryClient();
    const { showWatchlist } = useFramerateServices();

    return useMutation<
        ShowWatchlistEntry | null,
        unknown,
        ShowWatchlistEntrySaveRequest,
        Context
    >({
        mutationFn: (saveShowWatchlistEntryRequest) =>
            // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
            showWatchlist!.createEntry({ saveShowWatchlistEntryRequest }),
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
                updatedAt: new Date(),
                name: showDetails?.name ?? "Loading...",
            } satisfies ShowWatchlistEntry;

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

            queryClient.setQueryData<ShowWatchlistEntry>(
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

            queryClient.setQueryData<ShowWatchlistEntry>(
                ShowWatchlistKeys.entry(params.showId),
                context.previousEntry,
            );
        },
    });
};
