import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShowReview } from "../models";
import { ShowReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useShowReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ReviewKeys.details(reviewId),
        enabled: !!reviewId,
        queryFn: () =>
            // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
            ShowReviewService.getShowReview({ reviewId: reviewId!, session }),
        placeholderData: () =>
            queryClient
                .getQueryData<ShowReview[]>(["reviews"])
                ?.find((d) => d.reviewId === reviewId),
    });
};
