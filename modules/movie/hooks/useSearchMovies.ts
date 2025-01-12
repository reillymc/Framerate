import { useFramerateServices } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { MovieKeys } from "./keys";

export const useSearchMovies = (query: string) => {
    const { movies } = useFramerateServices();
    const searchQuery = useDebounce(query.trim(), 400);

    return useQuery({
        queryKey: MovieKeys.search(searchQuery),
        enabled: !!movies && searchQuery.length > 2,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => movies!.search({ query }),
    });
};
