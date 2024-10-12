import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieReview } from "../models";
import { MovieReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useMovieReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ReviewKeys.details(reviewId),
        enabled: !!reviewId,
        queryFn: () =>
            // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
            MovieReviewService.getMovieReview({ reviewId: reviewId!, session }),
        placeholderData: () =>
            queryClient
                .getQueryData<MovieReview[]>(["reviews"])
                ?.find((d) => d.reviewId === reviewId),
    });
};
