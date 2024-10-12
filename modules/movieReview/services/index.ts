import { getMovieReview } from "./getMovieReview";
import { getMovieReviews } from "./getMovieReviews";
import { saveMovieReview } from "./saveMovieReview";

export const MovieReviewService = {
    getMovieReviews,
    getMovieReview,
    saveMovieReview,
};

export { GetMovieReviewRequest } from "./getMovieReview";
export { GetMovieReviewsRequest } from "./getMovieReviews";
export { SaveReviewRequest } from "./saveMovieReview";
