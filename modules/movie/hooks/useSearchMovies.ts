import { useDebounce } from "@/hooks/useDebounce";
import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import { MovieKeys } from "./keys";

export const useSearchMovies = (query: string) => {
    const searchQuery = useDebounce(query.trim(), 400);
    const { session } = useSession();

    return useQuery({
        queryKey: MovieKeys.search(searchQuery),
        enabled: searchQuery.length > 2,
        queryFn: () =>
            MoviesService.searchMovies({ query: searchQuery, session }),
    });
};
