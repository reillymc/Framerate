import { useFramerateServices } from "@/hooks";
import type {
    ShowReviewApiFindAllRequest,
    ShowReviewApiFindByShowIdRequest,
} from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ShowReviewKeys } from "./keys";

export const useShowReviews = (
    params:
        | Omit<ShowReviewApiFindAllRequest, "page">
        | Partial<ShowReviewApiFindByShowIdRequest> = {},
) => {
    const { showReviews } = useFramerateServices();

    return useInfiniteQuery({
        queryKey: ShowReviewKeys.list(params),
        enabled: !!showReviews,
        queryFn: ({ pageParam = 1, signal }) =>
            "showId" in params
                ? // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                  showReviews!.findByShowId(
                      // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                      { showId: params.showId! },
                      { signal },
                  )
                : // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                  showReviews!.findAll(
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
