import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import type { MovieReview } from "../models";
import { MovieReviewKeys } from "./keys";

export const useMovieReview = (reviewId: string | undefined) => {
    const queryClient = useQueryClient();
    const { movieReviews } = useFramerateServices();

    return useQuery({
        queryKey: MovieReviewKeys.details(reviewId),
        enabled: !!movieReviews && !!reviewId,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: reviewId is guaranteed to be defined by the enabled flag
            movieReviews!.findByReviewId({ reviewId: reviewId! }, { signal }),
        placeholderData: (_) =>
            queryClient
                .getQueryData<MovieReview[]>(MovieReviewKeys.base)
                ?.find((movieReview) => movieReview.reviewId === reviewId),
    });
};
