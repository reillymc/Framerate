import { useSession } from "@/modules/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type GetReviewsRequest, ReviewsService } from "../services";
import { ReviewKeys } from "./keys";

export const useInfiniteReviews = (params: GetReviewsRequest) => {
    const { session } = useSession();

    return useInfiniteQuery({
        queryKey: ReviewKeys.infiniteList(params),
        queryFn: ({ pageParam = 1 }) =>
            ReviewsService.getReviews({ ...params, page: pageParam, session }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage?.length === 0) return;

            return lastPageParam + 1;
        },
    });
};
