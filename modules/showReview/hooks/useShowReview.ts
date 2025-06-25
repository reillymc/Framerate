import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import type { ShowReview } from "../models";
import { ShowReviewKeys } from "./keys";

export const useShowReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { showReviews } = useFramerateServices();

    return useQuery({
        queryKey: ShowReviewKeys.details(reviewId),
        enabled: !!showReviews && !!reviewId,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
            showReviews!.findByReviewId({ reviewId: reviewId! }, { signal }),
        placeholderData: (_) =>
            queryClient
                .getQueryData<ShowReview[]>(ShowReviewKeys.base)
                ?.find((showReview) => showReview.reviewId === reviewId),
    });
};
