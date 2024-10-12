import { useSession } from "@/modules/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type GetMovieReviewsRequest, MovieReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useMovieReviews = (
    params?: Omit<GetMovieReviewsRequest, "page">,
) => {
    const { session } = useSession();

    return useInfiniteQuery({
        queryKey: ReviewKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            MovieReviewService.getMovieReviews({
                ...params,
                page: pageParam,
                session,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage?.length === 0) return;

            return lastPageParam + 1;
        },
    });
};
