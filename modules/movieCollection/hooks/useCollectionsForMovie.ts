import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { MovieCollectionService } from "../services";
import { MovieCollectionKeys } from "./keys";

export const useCollectionsForMovie = (movieId: number | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: MovieCollectionKeys.byMovie(movieId),
        queryFn: () =>
            MovieCollectionService.getCollectionsForMovie({
                // biome-ignore lint/style/noNonNullAssertion: movieId is guaranteed to be defined by the enabled flag
                movieId: movieId!,
                session,
            }),
    });
};
