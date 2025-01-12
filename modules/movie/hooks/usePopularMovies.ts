import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { MovieKeys } from "./keys";

export const usePopularMovies = () => {
    const { movies } = useFramerateServices();

    return useQuery({
        queryKey: MovieKeys.popular(),
        enabled: !!movies,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => movies!.popular(),
    });
};
