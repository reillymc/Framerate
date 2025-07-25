import { useQuery } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import { MovieKeys } from "./keys";

export const usePopularMovies = () => {
    const { movies } = useFramerateServices();

    return useQuery({
        queryKey: MovieKeys.popular(),
        enabled: !!movies,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => movies!.popular({ signal }),
    });
};
