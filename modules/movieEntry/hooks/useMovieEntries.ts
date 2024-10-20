import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { watchlistId } from "../models";
import { MovieEntriesService } from "../services";
import { MovieEntryKeys } from "./keys";

export const useMovieEntries = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: MovieEntryKeys.listEntries(watchlistId),
        queryFn: () =>
            MovieEntriesService.getMovieEntries({ watchlistId, session }),
        select: (data) => data ?? undefined,
    });
};
