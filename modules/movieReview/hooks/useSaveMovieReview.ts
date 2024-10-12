import { useSession } from "@/modules/auth";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MovieReview } from "../models";
import { MovieReviewService, type SaveReviewRequest } from "../services";
import { ReviewKeys } from "./keys";

export const useSaveMovieReview = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        MovieReview | null,
        unknown,
        SaveReviewRequest,
        { previousEntry?: MovieReview }
    >({
        mutationFn: (params) =>
            MovieReviewService.saveMovieReview({ session, ...params }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ReviewKeys.base,
            }),
        onMutate: ({ reviewId, movieId, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<MovieReview>(
                ReviewKeys.details(reviewId),
            );

            const movieDetails = queryClient.getQueryData<Movie>(
                MovieKeys.details(movieId),
            );

            if (movieDetails) {
                // Optimistically update to the new value
                queryClient.setQueryData<MovieReview>(
                    ReviewKeys.details(reviewId),
                    {
                        ...params,
                        reviewId,
                        movie: movieDetails,
                    },
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<MovieReview>(
                ReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
