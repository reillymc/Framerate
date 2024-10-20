import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ShowEntry, watchlistId } from "../models";
import { ShowEntriesService } from "../services";
import { ShowEntryKeys } from "./keys";

export const useShowEntry = (showId: number | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ShowEntryKeys.listEntry(watchlistId, showId),
        enabled: !!showId,
        queryFn: () =>
            ShowEntriesService.getShowEntry({
                watchlistId,
                // biome-ignore lint/style/noNonNullAssertion: showId is guaranteed to be defined by the enabled flag
                showId: showId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<ShowEntry[]>(
                    ShowEntryKeys.listEntries(watchlistId),
                )
                ?.find((d) => d.showId === showId),
    });
};
