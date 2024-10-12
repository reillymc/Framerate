import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieReview } from "../models";

export type GetMovieReviewRequest = {
    reviewId: string;
};

type GetReview = FramerateService<MovieReview, GetMovieReviewRequest>;

export const getMovieReview: GetReview = ({ reviewId, session }) =>
    ExecuteRequest(FRAMERATE_API.movieReviews.getReview(reviewId), { session });
