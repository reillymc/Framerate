import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReviewSummary, ReviewsService } from "../services";

export const useReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["reviews", reviewId],
        enabled: !!reviewId,
        // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
        queryFn: () => ReviewsService.getReview({ reviewId: reviewId! }),
        placeholderData: () =>
            queryClient
                .getQueryData<ReviewSummary[]>(["reviews"])
                ?.find((d) => d.reviewId === reviewId),
    });
};
