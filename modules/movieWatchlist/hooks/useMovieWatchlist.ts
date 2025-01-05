import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { MovieWatchlistService } from "../services";
import { MovieWatchlistKeys } from "./keys";

export const useMovieWatchlist = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: MovieWatchlistKeys.base,
        queryFn: () => MovieWatchlistService.getWatchlist({ session }),
    });
};
