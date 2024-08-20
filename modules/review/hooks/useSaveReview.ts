import { placeholderUserId } from "@/constants/placeholderUser";
import { MovieKeys } from "@/modules/movie/hooks/keys";
import type { MovieDetails } from "@/modules/movie/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type ReviewDetails,
    ReviewsService,
    type SaveReviewParams,
} from "../services";
import { ReviewKeys } from "./keys";

export const useSaveReview = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<null>,
        unknown,
        SaveReviewParams,
        { previousEntry?: ReviewDetails }
    >({
        mutationKey: ReviewKeys.mutate,
        mutationFn: ReviewsService.saveReview,
        onSuccess: async (_response) => {
            await queryClient.invalidateQueries({
                queryKey: ReviewKeys.mutate,
            });
        },
        onMutate: ({ reviewId, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<ReviewDetails>(
                ReviewKeys.details(reviewId),
            );

            const movieDetails = queryClient.getQueryData<MovieDetails>(
                MovieKeys.details(params.mediaId),
            );

            // Optimistically update to the new value
            queryClient.setQueryData<ReviewDetails>(
                ReviewKeys.details(reviewId),
                {
                    ...movieDetails,
                    ...params,
                    reviewId,
                    userId: placeholderUserId,
                    mediaReleaseYear: movieDetails?.releaseDate
                        ? new Date(movieDetails?.releaseDate).getFullYear()
                        : new Date().getFullYear(),
                    mediaTitle: movieDetails?.title ?? "",
                } satisfies ReviewDetails,
            );

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<ReviewDetails>(
                ReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
