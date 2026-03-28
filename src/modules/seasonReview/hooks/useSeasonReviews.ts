import { useInfiniteQuery } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";
import type { SeasonReviewApiFindByShowSeasonRequest } from "@/services";

import { SeasonReviewKeys } from "./keys";

export const useSeasonReviews = ({
    seasonNumber,
    showId,
}: Partial<SeasonReviewApiFindByShowSeasonRequest>) => {
    const { seasonReviews } = useFramerateServices();

    return useInfiniteQuery({
        queryKey: SeasonReviewKeys.list({ showId, seasonNumber }),
        enabled: !!seasonReviews && !!showId && seasonNumber !== undefined,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
            seasonReviews!.findByShowSeason(
                {
                    // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                    showId: showId!,
                    // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
                    seasonNumber: seasonNumber!,
                },
                { signal },
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage?.length === 0) return;

            return lastPageParam + 1;
        },
    });
};
