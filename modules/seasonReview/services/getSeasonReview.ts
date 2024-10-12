import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { SeasonReview } from "../models";

export type GetSeasonReviewRequest = {
    reviewId: string;
};

type GetReview = FramerateService<SeasonReview, GetSeasonReviewRequest>;

export const getSeasonReview: GetReview = ({ reviewId, session }) =>
    ExecuteRequest(FRAMERATE_API.seasonReviews.getReview(reviewId), {
        session,
    });
