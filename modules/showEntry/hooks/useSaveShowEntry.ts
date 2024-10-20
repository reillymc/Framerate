import { useSession } from "@/modules/auth";
import type { Show } from "@/modules/show";
import { ShowKeys } from "@/modules/show/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ShowEntry, watchlistId } from "../models";
import { type SaveShowEntryRequest, ShowEntriesService } from "../services";
import { ShowEntryKeys } from "./keys";

type Context = { previousEntries?: ShowEntry[]; previousEntry?: ShowEntry };

export const useSaveShowEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        ShowEntry | null,
        unknown,
        Omit<SaveShowEntryRequest, "watchlistId">,
        Context
    >({
        mutationKey: ShowEntryKeys.mutate,
        mutationFn: (params) =>
            ShowEntriesService.saveShowEntry({
                session,
                watchlistId,
                ...params,
            }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowEntryKeys.listEntries(watchlistId),
            }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntries =
                queryClient.getQueryData<ShowEntry[]>(
                    ShowEntryKeys.listEntries(watchlistId),
                ) ?? [];

            const previousEntry = queryClient.getQueryData<ShowEntry>(
                ShowEntryKeys.listEntry(watchlistId, params.showId),
            );

            const showDetails = queryClient.getQueryData<Show>(
                ShowKeys.details(params.showId),
            );

            const showDetailsPopular = queryClient
                .getQueryData<Show[]>(ShowKeys.popular())
                ?.find(({ id }) => id === params.showId);

            const updatedEntry = {
                ...showDetailsPopular,
                ...showDetails,
                ...params,
                name: showDetails?.name ?? showDetailsPopular?.name ?? "",
                lastAirDate:
                    showDetails?.lastAirDate ?? showDetailsPopular?.lastAirDate,
                firstAirDate:
                    showDetails?.firstAirDate ??
                    showDetailsPopular?.firstAirDate,
                nextAirDate:
                    showDetails?.nextAirDate ?? showDetailsPopular?.nextAirDate,
                posterPath:
                    showDetails?.posterPath ?? showDetailsPopular?.posterPath,
            } satisfies ShowEntry;

            // Optimistically update to the new value
            queryClient.setQueryData<ShowEntry[]>(
                ShowEntryKeys.listEntries(watchlistId),
                [updatedEntry, ...previousEntries].sort((a, b) =>
                    a.firstAirDate && b.firstAirDate
                        ? new Date(b.firstAirDate).getTime() -
                          new Date(a.firstAirDate).getTime()
                        : -1,
                ),
            );

            queryClient.setQueryData<ShowEntry>(
                ShowEntryKeys.listEntry(watchlistId, params.showId),
                updatedEntry,
            );

            // Return snapshot so we can rollback in case of failure
            return { previousEntries, previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<ShowEntry[]>(
                ShowEntryKeys.listEntries(watchlistId),
                context.previousEntries,
            );

            queryClient.setQueryData<ShowEntry>(
                ShowEntryKeys.listEntry(watchlistId, params.showId),
                context.previousEntry,
            );
        },
    });
};
