import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/modules/auth";
import type { Company } from "@/modules/company";
import { CompanyKeys } from "@/modules/company/hooks/keys";
import type { Movie } from "@/modules/movie";
import { MovieKeys } from "@/modules/movie/hooks/keys";

import { useFramerateServices } from "@/hooks";
import type {
    BuildSaveRequest,
    MovieReviewApiCreateRequest,
    MovieReviewApiUpdateRequest,
} from "@/services";

import type { MovieReview } from "../models";
import { MovieReviewKeys } from "./keys";

type MovieReviewSaveRequest = BuildSaveRequest<
    MovieReviewApiCreateRequest,
    MovieReviewApiUpdateRequest,
    "movieId",
    "reviewId",
    "saveMovieReviewRequest",
    "saveMovieReviewRequest"
>;

export const useSaveMovieReview = () => {
    const queryClient = useQueryClient();
    const { movieReviews } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<
        MovieReview | null,
        unknown,
        MovieReviewSaveRequest,
        { previousEntry?: MovieReview }
    >({
        mutationFn: ({ reviewId, movieId, ...params }) =>
            reviewId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  movieReviews!.update({
                      reviewId,
                      movieId,
                      saveMovieReviewRequest: params,
                  })
                : // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  movieReviews!.create({
                      movieId,
                      saveMovieReviewRequest: params,
                  }),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: MovieReviewKeys.base,
            }),
        onMutate: ({ reviewId, movieId, ...params }) => {
            if (!reviewId) return;
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<MovieReview>(
                MovieReviewKeys.details(reviewId),
            );

            const movieDetails = queryClient.getQueryData<Movie>(
                MovieKeys.details(movieId),
            );

            const companyList = queryClient.getQueryData<Company[]>(
                CompanyKeys.list(),
            );

            if (movieDetails) {
                // Optimistically update to the new value
                queryClient.setQueryData<MovieReview>(
                    MovieReviewKeys.details(reviewId),
                    {
                        ...params,
                        reviewId,
                        userId,
                        movie: movieDetails,
                        company: params.company?.map((companyItem) => {
                            const matchedCompany = companyList?.find(
                                ({ companyId }) =>
                                    companyId === companyItem.companyId,
                            );
                            return {
                                ...companyItem,
                                firstName: matchedCompany?.firstName ?? "...",
                                lastName: matchedCompany?.lastName ?? "...",
                            };
                        }),
                    } satisfies MovieReview,
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, params, context) => {
            console.warn(error);
            if (!(context && params.reviewId)) return;

            queryClient.setQueryData<MovieReview>(
                MovieReviewKeys.details(params.reviewId),
                context.previousEntry,
            );
        },
    });
};
