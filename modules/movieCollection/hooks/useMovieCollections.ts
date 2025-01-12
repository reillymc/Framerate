import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { MovieCollectionKeys } from "./keys";

export const useMovieCollections = () => {
    const { movieCollections } = useFramerateServices();

    return useQuery({
        queryKey: MovieCollectionKeys.base,
        enabled: !!movieCollections,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        queryFn: () => movieCollections!.findAll(),
    });
};
