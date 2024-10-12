import { useSession } from "@/modules/auth";
import type { Season } from "@/modules/season";
import { SeasonKeys } from "@/modules/season/hooks/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SeasonReview } from "../models";
import { type SaveReviewRequest, SeasonReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useSaveSeasonReview = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        SeasonReview | null,
        unknown,
        SaveReviewRequest,
        { previousEntry?: SeasonReview }
    >({
        mutationFn: (params) =>
            SeasonReviewService.saveSeasonReview({ session, ...params }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ReviewKeys.base,
            }),
        onMutate: ({ reviewId, showId, seasonNumber, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<SeasonReview>(
                ReviewKeys.details(reviewId),
            );

            const seasonDetails = queryClient.getQueryData<Season>(
                SeasonKeys.details(showId, seasonNumber),
            );

            if (seasonDetails) {
                // Optimistically update to the new value
                queryClient.setQueryData<SeasonReview>(
                    ReviewKeys.details(reviewId),
                    {
                        ...params,
                        reviewId,
                        season: seasonDetails,
                    },
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<SeasonReview>(
                ReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
