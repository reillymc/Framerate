import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Review, ReviewCompanySummary } from "@/modules/review";
import type { ShowReview } from "../models";

export type SaveReviewRequest = Pick<
    Review,
    "date" | "rating" | "title" | "description" | "venue" | "company"
> & {
    reviewId?: string;
    showId: number;
    company?: Array<ReviewCompanySummary>;
};

type SaveReview = FramerateService<ShowReview, SaveReviewRequest>;

export const saveShowReview: SaveReview = ({
    session,
    showId,
    reviewId,
    ...body
}) =>
    ExecuteRequest(FRAMERATE_API.showReviews.saveReview(showId, reviewId), {
        session,
        body,
    });
