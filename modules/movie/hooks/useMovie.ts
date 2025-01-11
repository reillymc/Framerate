import { useFramerateServices } from "@/hooks/useFramerateServices";
import { useQuery } from "@tanstack/react-query";
import { MovieKeys } from "./keys";

export const useMovie = (id: number | undefined) => {
    const { movies } = useFramerateServices();

    return useQuery({
        queryKey: MovieKeys.details(id),
        enabled: !!movies && !!id,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => movies!.details({ movieId: id! }),
    });
};
