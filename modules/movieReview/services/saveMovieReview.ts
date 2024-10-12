import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Review, ReviewCompanySummary } from "@/modules/review";
import type { MovieReview } from "../models";

export type SaveReviewRequest = Pick<
    Review,
    "date" | "rating" | "title" | "description" | "venue" | "company"
> & {
    reviewId?: string;
    movieId: number;
    company?: Array<ReviewCompanySummary>;
};

type SaveReview = FramerateService<MovieReview, SaveReviewRequest>;

export const saveMovieReview: SaveReview = ({
    session,
    reviewId,
    movieId,
    ...body
}) =>
    ExecuteRequest(FRAMERATE_API.movieReviews.saveReview(movieId, reviewId), {
        session,
        body,
    });
