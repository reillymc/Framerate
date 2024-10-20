import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type MovieEntry, watchlistId } from "../models";
import { MovieEntriesService } from "../services";
import { MovieEntryKeys } from "./keys";

export const useMovieEntry = (movieId: number | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: MovieEntryKeys.listEntry(watchlistId, movieId),
        enabled: !!movieId,
        queryFn: () =>
            MovieEntriesService.getMovieEntry({
                watchlistId,
                // biome-ignore lint/style/noNonNullAssertion: movieId is guaranteed to be defined by the enabled flag
                movieId: movieId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<MovieEntry[]>(
                    MovieEntryKeys.listEntries(watchlistId),
                )
                ?.find((d) => d.movieId === movieId),
    });
};
