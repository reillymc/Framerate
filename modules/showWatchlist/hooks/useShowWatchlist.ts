import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ShowWatchlistKeys } from "./keys";

export const useShowWatchlist = () => {
    const { showWatchlist } = useFramerateServices();

    return useQuery({
        queryKey: ShowWatchlistKeys.base,
        enabled: !!showWatchlist,
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        queryFn: ({ signal }) => showWatchlist!.find({ signal }),
    });
};
