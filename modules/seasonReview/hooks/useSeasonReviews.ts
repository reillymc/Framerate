import { useSession } from "@/modules/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type GetSeasonReviewsRequest, SeasonReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useSeasonReviews = (params: GetSeasonReviewsRequest) => {
    const { session } = useSession();

    return useInfiniteQuery({
        queryKey: ReviewKeys.list(params),
        queryFn: () =>
            SeasonReviewService.getSeasonReviews({
                ...params,
                session,
            }),
        initialPageParam: 1,
        getNextPageParam: () => undefined,
    });
};
