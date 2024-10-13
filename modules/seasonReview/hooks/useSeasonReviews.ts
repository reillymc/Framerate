import { useSession } from "@/modules/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type GetSeasonReviewsRequest, SeasonReviewService } from "../services";
import { ReviewKeys } from "./keys";

export const useSeasonReviews = ({
    seasonNumber,
    showId,
}: Partial<GetSeasonReviewsRequest>) => {
    const { session } = useSession();

    return useInfiniteQuery({
        queryKey: ReviewKeys.list({ seasonNumber, showId }),
        enabled: !!seasonNumber && !!showId,
        queryFn: () =>
            SeasonReviewService.getSeasonReviews({
                // biome-ignore lint/style/noNonNullAssertion: guaranteed to be defined by the enabled flag
                seasonNumber: seasonNumber!,
                // biome-ignore lint/style/noNonNullAssertion: guaranteed to be defined by the enabled flag
                showId: showId!,
                session,
            }),
        initialPageParam: 1,
        getNextPageParam: () => undefined,
    });
};
