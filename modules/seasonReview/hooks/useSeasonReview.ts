import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SeasonReview } from "../models";
import { SeasonReviewKeys } from "./keys";

export const useSeasonReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { seasonReviews } = useFramerateServices();

    return useQuery({
        queryKey: SeasonReviewKeys.details(reviewId),
        enabled: !!seasonReviews && !!reviewId,
        // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
        queryFn: () => seasonReviews!.findByReviewId({ reviewId: reviewId! }),
        placeholderData: () =>
            queryClient
                .getQueryData<SeasonReview[]>(SeasonReviewKeys.base)
                ?.find((seasonReview) => seasonReview.reviewId === reviewId),
    });
};
