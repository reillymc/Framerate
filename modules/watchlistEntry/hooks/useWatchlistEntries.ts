import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { WatchlistEntriesService } from "../services";
import { WatchlistEntryKeys } from "./keys";

export const useWatchlistEntries = (mediaType: string | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: WatchlistEntryKeys.listEntries(mediaType),
        enabled: !!mediaType,
        queryFn: () =>
            WatchlistEntriesService.getWatchlistEntries({
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaType: mediaType!,
                session,
            }),
        select: (data) => data ?? undefined,
    });
};
