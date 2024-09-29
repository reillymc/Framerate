import { useDebounce } from "@/hooks/useDebounce";
import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ShowsService } from "../services";
import { ShowKeys } from "./keys";

export const useSearchShows = (query: string) => {
    const searchQuery = useDebounce(query.trim(), 400);
    const { session } = useSession();

    return useQuery({
        queryKey: ShowKeys.search(searchQuery),
        enabled: searchQuery.length > 2,
        queryFn: () =>
            ShowsService.searchShows({ query: searchQuery, session }),
    });
};
