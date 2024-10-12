import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SeasonReview } from "../models";
import { SeasonReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useSeasonReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ReviewKeys.details(reviewId),
        enabled: !!reviewId,
        queryFn: () =>
            SeasonReviewService.getSeasonReview({
                // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
                reviewId: reviewId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<SeasonReview[]>(["reviews"])
                ?.find((seasonReview) => seasonReview.reviewId === reviewId),
    });
};
