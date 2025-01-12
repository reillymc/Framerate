import { useFramerateServices } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { ShowKeys } from "./keys";

export const useSearchShows = (query: string) => {
    const { shows } = useFramerateServices();
    const searchQuery = useDebounce(query.trim(), 400);

    return useQuery({
        queryKey: ShowKeys.search(searchQuery),
        enabled: !!shows && searchQuery.length > 2,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => shows!.search({ query: searchQuery }),
    });
};
