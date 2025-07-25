import { useQuery } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import { MovieKeys } from "./keys";

export const useMovie = (id: number | undefined) => {
    const { movies } = useFramerateServices();

    return useQuery({
        queryKey: MovieKeys.details(id),
        enabled: !!movies && !!id,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => movies!.details({ movieId: id! }, { signal }),
    });
};
