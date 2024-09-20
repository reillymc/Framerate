import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReviewSummary, ReviewsService } from "../services";
import { ReviewKeys } from "./keys";

export const useReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ReviewKeys.details(reviewId),
        enabled: !!reviewId,
        queryFn: () =>
            // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
            ReviewsService.getReview({ reviewId: reviewId!, session }),
        placeholderData: () =>
            queryClient
                .getQueryData<ReviewSummary[]>(["reviews"])
                ?.find((d) => d.reviewId === reviewId),
    });
};
