import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowReview } from "../models";

export type GetShowReviewsRequest = {
    showId?: number;
    orderBy?: "rating" | "date" | "mediaTitle" | "mediaReleaseDate";
    sort?: "asc" | "desc";
    page?: number;
    pageSize?: number;
    ratingMin?: number;
    ratingMax?: number;
    atVenue?: string;
    withCompany?: string;
};

type GetReviews = FramerateService<ShowReview[], GetShowReviewsRequest>;

export const getShowReviews: GetReviews = async ({
    showId,
    session,
    ...params
}) =>
    ExecuteRequest(FRAMERATE_API.showReviews.getReviews(showId, params), {
        session,
    });
