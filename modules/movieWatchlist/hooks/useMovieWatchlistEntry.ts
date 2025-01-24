import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieWatchlist } from "../models";
import { MovieWatchlistKeys } from "./keys";

export const useMovieWatchlistEntry = (movieId: number | undefined) => {
    const queryClient = useQueryClient();
    const { movieWatchlist } = useFramerateServices();

    return useQuery({
        queryKey: MovieWatchlistKeys.entry(movieId),
        enabled: !!movieWatchlist && !!movieId,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
            movieWatchlist!.findEntry({ movieId: movieId! }, { signal }),
        placeholderData: (_) =>
            queryClient
                .getQueryData<MovieWatchlist>(MovieWatchlistKeys.base)
                ?.entries?.find((d) => d.movieId === movieId),
        retry: false,
    });
};
