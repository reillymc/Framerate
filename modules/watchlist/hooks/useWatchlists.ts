import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { WatchlistsService } from "../services";

export const useWatchlists = (mediaType: string | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: ["watchlists", mediaType],
        enabled: !!mediaType,
        queryFn: () =>
            WatchlistsService.getWatchlists({
                // biome-ignore lint/style/noNonNullAssertion: mediaType is guaranteed to be defined by the enabled flag
                mediaType: mediaType!,
                session,
            }),
    });
};
