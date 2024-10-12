import { getShowReview } from "./getShowReview";
import { getShowReviews } from "./getShowReviews";
import { saveShowReview } from "./saveShowReview";

export const ShowReviewService = {
    getShowReviews,
    getShowReview,
    saveShowReview,
};

export { GetShowReviewRequest } from "./getShowReview";
export { GetShowReviewsRequest } from "./getShowReviews";
export { SaveReviewRequest } from "./saveShowReview";
