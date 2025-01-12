import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import type { Company } from "@/modules/company";
import { CompanyKeys } from "@/modules/company/hooks/keys";
import type { Show } from "@/modules/show";
import { ShowKeys } from "@/modules/show/hooks/keys";
import type {
    BuildSaveRequest,
    ShowReviewApiCreateRequest,
    ShowReviewApiUpdateRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShowReview } from "../models";
import { ShowReviewKeys } from "./keys";

type ShowReviewSaveRequest = BuildSaveRequest<
    ShowReviewApiCreateRequest,
    ShowReviewApiUpdateRequest,
    "showId",
    "reviewId",
    "saveShowReviewRequest",
    "saveShowReviewRequest"
>;

export const useSaveShowReview = () => {
    const queryClient = useQueryClient();
    const { showReviews } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<
        ShowReview | null,
        unknown,
        ShowReviewSaveRequest,
        { previousEntry?: ShowReview }
    >({
        mutationFn: ({ reviewId, showId, ...params }) =>
            reviewId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  showReviews!.update({
                      reviewId,
                      showId,
                      saveShowReviewRequest: params,
                  })
                : // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  showReviews!.create({
                      showId,
                      saveShowReviewRequest: params,
                  }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ShowReviewKeys.base,
            }),
        onMutate: ({ reviewId, showId, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<ShowReview>(
                ShowReviewKeys.details(reviewId),
            );

            const showDetails = queryClient.getQueryData<Show>(
                ShowKeys.details(showId),
            );

            const companyList = queryClient.getQueryData<Company[]>(
                CompanyKeys.list(),
            );

            if (showDetails) {
                // Optimistically update to the new value
                queryClient.setQueryData<ShowReview>(
                    ShowReviewKeys.details(reviewId),
                    {
                        ...params,
                        reviewId,
                        userId,
                        show: showDetails,
                        company: params.company?.map((companyItem) => {
                            const matchedCompany = companyList?.find(
                                ({ userId }) => userId === companyItem.userId,
                            );
                            return {
                                ...companyItem,
                                firstName: matchedCompany?.firstName ?? "...",
                                lastName: matchedCompany?.lastName ?? "...",
                            };
                        }),
                    } satisfies ShowReview,
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<ShowReview>(
                ShowReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
