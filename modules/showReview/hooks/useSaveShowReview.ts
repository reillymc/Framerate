import { useSession } from "@/modules/auth";
import type { Show } from "@/modules/show";
import { ShowKeys } from "@/modules/show/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowReview } from "../models";
import { type SaveReviewRequest, ShowReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useSaveShowReview = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        ShowReview | null,
        unknown,
        SaveReviewRequest,
        { previousEntry?: ShowReview }
    >({
        mutationFn: (params) =>
            ShowReviewService.saveShowReview({ session, ...params }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ReviewKeys.base,
            }),
        onMutate: ({ reviewId, showId, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<ShowReview>(
                ReviewKeys.details(reviewId),
            );

            const showDetails = queryClient.getQueryData<Show>(
                ShowKeys.details(showId),
            );

            if (showDetails) {
                // Optimistically update to the new value
                queryClient.setQueryData<ShowReview>(
                    ReviewKeys.details(reviewId),
                    {
                        ...params,
                        reviewId,
                        show: showDetails,
                    },
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<ShowReview>(
                ReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
