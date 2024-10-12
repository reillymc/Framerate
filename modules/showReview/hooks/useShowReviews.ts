import { useSession } from "@/modules/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type GetShowReviewsRequest, ShowReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useShowReviews = (
    params?: Omit<GetShowReviewsRequest, "page">,
) => {
    const { session } = useSession();

    return useInfiniteQuery({
        queryKey: ReviewKeys.list(params),
        queryFn: ({ pageParam = 1 }) =>
            ShowReviewService.getShowReviews({
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
