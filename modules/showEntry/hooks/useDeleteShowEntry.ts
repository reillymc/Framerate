import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ShowEntry, watchlistId } from "../models";
import {
    type DeleteShowEntryRequest,
    type DeleteShowEntryResponse,
    ShowEntriesService,
} from "../services";
import { ShowEntryKeys } from "./keys";

type Context = { previousEntries?: ShowEntry[]; previousEntry?: ShowEntry };

export const useDeleteShowEntry = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        DeleteShowEntryResponse | null,
        unknown,
        Omit<DeleteShowEntryRequest, "watchlistId">,
        Context
    >({
        mutationKey: ShowEntryKeys.mutate,
        mutationFn: (params) =>
            ShowEntriesService.deleteShowEntry({
                ...params,
                watchlistId,
                session,
            }),
        onSuccess: (_response) =>
            queryClient.invalidateQueries({
                queryKey: ShowEntryKeys.listEntries(watchlistId),
            }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousEntries = queryClient.getQueryData<ShowEntry[]>(
                ShowEntryKeys.listEntries(watchlistId),
            );

            const previousEntry = queryClient.getQueryData<ShowEntry>(
                ShowEntryKeys.listEntry(watchlistId, params.showId),
            );

            // Optimistically delete the entry
            queryClient.setQueryData(
                ShowEntryKeys.listEntries(watchlistId),
                previousEntries?.filter(
                    ({ showId }) => showId !== params.showId,
                ),
            );

            queryClient.setQueryData(
                ShowEntryKeys.listEntry(watchlistId, params.showId),
                null,
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
