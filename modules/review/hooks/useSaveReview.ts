import { placeholderUserId } from "@/constants/placeholderUser";
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

            // Optimistically update to the new value
            queryClient.setQueryData<ReviewDetails>(
                ReviewKeys.details(reviewId),
                {
                    ...params,
                    reviewId,
                    userId: placeholderUserId,
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
