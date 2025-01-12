import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShowReview } from "../models";
import { ShowReviewKeys } from "./keys";

export const useShowReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { showReviews } = useFramerateServices();

    return useQuery({
        queryKey: ShowReviewKeys.details(reviewId),
        enabled: !!showReviews && !!reviewId,
        // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
        queryFn: () => showReviews!.findByReviewId({ reviewId: reviewId! }),
        placeholderData: () =>
            queryClient
                .getQueryData<ShowReview[]>(ShowReviewKeys.base)
                ?.find((showReview) => showReview.reviewId === reviewId),
    });
};
