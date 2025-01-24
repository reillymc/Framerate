import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShowWatchlist } from "../models";
import { ShowWatchlistKeys } from "./keys";

export const useShowWatchlistEntry = (showId: number | undefined) => {
    const queryClient = useQueryClient();
    const { showWatchlist } = useFramerateServices();

    return useQuery({
        queryKey: ShowWatchlistKeys.entry(showId),
        enabled: !!showWatchlist && !!showId,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
            showWatchlist!.findEntry({ showId: showId! }, { signal }),
        placeholderData: (_) =>
            queryClient
                .getQueryData<ShowWatchlist>(ShowWatchlistKeys.base)
                ?.entries?.find((d) => d.showId === showId),
        retry: false,
    });
};
