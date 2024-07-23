import { getReview } from "./getReview";
import { getReviews } from "./getReviews";
import { saveReview } from "./saveReview";

export const ReviewsService = {
    getReviews,
    getReview,
    saveReview,
};

export { ReviewDetails } from "./getReview";
export { ReviewSummary } from "./getReviews";
export { SaveReviewParams } from "./saveReview";
