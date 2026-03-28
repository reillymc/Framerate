import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import type { SeasonReview } from "../models";
import { SeasonReviewKeys } from "./keys";

export const useSeasonReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { seasonReviews } = useFramerateServices();

    return useQuery({
        queryKey: SeasonReviewKeys.details(reviewId),
        enabled: !!seasonReviews && !!reviewId,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
            seasonReviews!.findByReviewId({ reviewId: reviewId! }, { signal }),
        placeholderData: (_) =>
            queryClient
                .getQueryData<SeasonReview[]>(SeasonReviewKeys.base)
                ?.find((seasonReview) => seasonReview.reviewId === reviewId),
    });
};
