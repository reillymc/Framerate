import { getSeasonReview } from "./getSeasonReview";
import { getSeasonReviews } from "./getSeasonReviews";
import { saveSeasonReview } from "./saveSeasonReview";

export const SeasonReviewService = {
    getSeasonReviews,
    getSeasonReview,
    saveSeasonReview,
};

export { GetSeasonReviewRequest } from "./getSeasonReview";
export { GetSeasonReviewsRequest } from "./getSeasonReviews";
export { SaveReviewRequest } from "./saveSeasonReview";
