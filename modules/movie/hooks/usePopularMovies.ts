import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import { MovieKeys } from "./keys";

export const usePopularMovies = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: MovieKeys.popular(),
        queryFn: () => MoviesService.getPopularMovies({ session }),
        enabled: !!session,
    });
};
