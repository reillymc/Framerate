import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { MovieWatchlistKeys } from "./keys";

export const useMovieWatchlist = () => {
    const { movieWatchlist } = useFramerateServices();

    return useQuery({
        queryKey: MovieWatchlistKeys.base,
        enabled: !!movieWatchlist,
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        queryFn: ({ signal }) => movieWatchlist!.find({ signal }),
    });
};
