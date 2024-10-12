import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Review, ReviewCompanySummary } from "@/modules/review";
import type { SeasonReview } from "../models";

export type SaveReviewRequest = Pick<
    Review,
    "date" | "rating" | "title" | "description" | "venue" | "company"
> & {
    reviewId?: string;
    showId: number;
    seasonNumber: number;
    company?: Array<ReviewCompanySummary>;
};

type SaveReview = FramerateService<SeasonReview, SaveReviewRequest>;

export const saveSeasonReview: SaveReview = ({
    session,
    showId,
    seasonNumber,
    reviewId,
    ...body
}) =>
    ExecuteRequest(
        FRAMERATE_API.seasonReviews.saveReview(showId, seasonNumber, reviewId),
        {
            session,
            body,
        },
    );
