import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieReview } from "../models";

export type GetMovieReviewsRequest = {
    movieId?: number;
    orderBy?: "rating" | "date" | "mediaTitle" | "mediaReleaseDate";
    sort?: "asc" | "desc";
    page?: number;
    pageSize?: number;
    ratingMin?: number;
    ratingMax?: number;
    atVenue?: string;
    withCompany?: string;
};

type GetReviews = FramerateService<MovieReview[], GetMovieReviewsRequest>;

export const getMovieReviews: GetReviews = async ({
    movieId,
    session,
    ...params
}) =>
    ExecuteRequest(FRAMERATE_API.movieReviews.getReviews(movieId, params), {
        session,
    });
