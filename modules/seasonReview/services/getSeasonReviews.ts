import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { SeasonReview } from "../models";

export type GetSeasonReviewsRequest = {
    showId: number;
    seasonNumber: number;
};

type GetReviews = FramerateService<SeasonReview[], GetSeasonReviewsRequest>;

export const getSeasonReviews: GetReviews = async ({
    showId,
    seasonNumber,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.seasonReviews.getReviews(showId, seasonNumber),
        {
            session,
        },
    );
