import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewsService, type SaveReviewParams } from "../services";

export const useSaveReview = () => {
    const queryClient = useQueryClient();

    return useMutation<Awaited<null>, unknown, SaveReviewParams, unknown>({
        mutationKey: ["reviews", "save"],
        mutationFn: ReviewsService.saveReview,
        onSuccess: async (_response) => {
            await queryClient.invalidateQueries({
                queryKey: ["reviews"],
            });
        },
        onError: console.warn,
    });
};
