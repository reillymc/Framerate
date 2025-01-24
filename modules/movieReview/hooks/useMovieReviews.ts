import { useFramerateServices } from "@/hooks";
import type {
    MovieReviewApiFindAllRequest,
    MovieReviewApiFindByMovieIdRequest,
} from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MovieReviewKeys } from "./keys";

export const useMovieReviews = (
    params:
        | Omit<MovieReviewApiFindAllRequest, "page">
        | Partial<MovieReviewApiFindByMovieIdRequest> = {},
) => {
    const { movieReviews } = useFramerateServices();

    return useInfiniteQuery({
        queryKey: MovieReviewKeys.list(params),
        enabled: !!movieReviews,
        queryFn: ({ pageParam = 1, signal }) =>
            "movieId" in params
                ? // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                  movieReviews!.findByMovieId(
                      // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                      { movieId: params.movieId! },
                      { signal },
                  )
                : // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                  movieReviews!.findAll(
                      { ...params, page: pageParam },
                      { signal },
                  ),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage?.length === 0) return;

            return lastPageParam + 1;
        },
    });
};
