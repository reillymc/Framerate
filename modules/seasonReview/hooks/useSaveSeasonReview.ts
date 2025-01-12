import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import type { Company } from "@/modules/company";
import { CompanyKeys } from "@/modules/company/hooks/keys";
import type { Season } from "@/modules/season";
import { SeasonKeys } from "@/modules/season/hooks/keys";
import type {
    BuildSaveRequest,
    SeasonReviewApiCreateRequest,
    SeasonReviewApiUpdateRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SeasonReview } from "../models";
import { SeasonReviewKeys } from "./keys";

type SeasonReviewSaveRequest = BuildSaveRequest<
    SeasonReviewApiCreateRequest,
    SeasonReviewApiUpdateRequest,
    "showId" | "seasonNumber",
    "reviewId",
    "saveSeasonReviewRequest",
    "saveSeasonReviewRequest"
>;

export const useSaveSeasonReview = () => {
    const queryClient = useQueryClient();
    const { seasonReviews } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<
        SeasonReview | null,
        unknown,
        SeasonReviewSaveRequest,
        { previousEntry?: SeasonReview }
    >({
        mutationFn: ({ reviewId, showId, seasonNumber, ...params }) =>
            reviewId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  seasonReviews!.update({
                      reviewId,
                      showId,
                      seasonNumber,
                      saveSeasonReviewRequest: params,
                  })
                : // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  seasonReviews!.create({
                      showId,
                      seasonNumber,
                      saveSeasonReviewRequest: params,
                  }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: SeasonReviewKeys.base,
            }),
        onMutate: ({ reviewId, showId, seasonNumber, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<SeasonReview>(
                SeasonReviewKeys.details(reviewId),
            );

            const seasonDetails = queryClient.getQueryData<Season>(
                SeasonKeys.details(showId, seasonNumber),
            );

            const companyList = queryClient.getQueryData<Company[]>(
                CompanyKeys.list(),
            );

            if (seasonDetails) {
                // Optimistically update to the new value
                queryClient.setQueryData<SeasonReview>(
                    SeasonReviewKeys.details(reviewId),
                    {
                        ...params,
                        reviewId,
                        userId,
                        season: seasonDetails,
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
                    } satisfies SeasonReview,
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<SeasonReview>(
                SeasonReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
