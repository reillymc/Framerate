import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewsService, type SaveReviewParams } from "../services";

export const useSaveReview = () => {
    const queryClient = useQueryClient();

    return useMutation<Awaited<null>, unknown, SaveReviewParams, unknown>({
        mutationKey: ["reviews", "save"],
        mutationFn: ReviewsService.saveReview,
        onSuccess: async (_response, params) => {
            await queryClient.invalidateQueries({
                queryKey: ["reviews", params.reviewId],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: ["reviews"],
                exact: true,
            });
            await queryClient.invalidateQueries({
                queryKey: ["reviews", params.mediaId],
                exact: true,
            });
            if (params.reviewId) {
                await queryClient.invalidateQueries({
                    queryKey: ["review", params.reviewId],
                    exact: true,
                });
            }
        },
        onError: console.warn,
    });
};
