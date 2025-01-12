import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MovieReview } from "../models";
import { MovieReviewKeys } from "./keys";

export const useMovieReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { movieReviews } = useFramerateServices();

    return useQuery({
        queryKey: MovieReviewKeys.details(reviewId),
        enabled: !!movieReviews && !!reviewId,
        // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
        queryFn: () => movieReviews!.findByReviewId({ reviewId: reviewId! }),
        placeholderData: () =>
            queryClient
                .getQueryData<MovieReview[]>(MovieReviewKeys.base)
                ?.find((movieReview) => movieReview.reviewId === reviewId),
    });
};
