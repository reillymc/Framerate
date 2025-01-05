import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieWatchlist } from "../models";
import { MovieWatchlistService } from "../services";
import { MovieWatchlistKeys } from "./keys";

export const useMovieWatchlistEntry = (movieId: number | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: MovieWatchlistKeys.entry(movieId),
        enabled: !!movieId,
        queryFn: () =>
            MovieWatchlistService.getEntry({
                // biome-ignore lint/style/noNonNullAssertion: movieId is guaranteed to be defined by the enabled flag
                movieId: movieId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<MovieWatchlist>(["movie", "watchlist"])
                ?.entries?.find((d) => d.movieId === movieId),
    });
};
