import { useInfiniteQuery } from "@tanstack/react-query";
import { ReviewsService } from "../services";
import type { GetReviewParams } from "../services/getReviews";
import { ReviewKeys } from "./keys";

export const useInfiniteReviews = (params: GetReviewParams) => {
    return useInfiniteQuery({
        queryKey: ReviewKeys.infiniteList(params),
        queryFn: ({ pageParam = 1 }) =>
            ReviewsService.getReviews({ ...params, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage?.length === 0) return;

            return lastPageParam + 1;
        },
    });
};
