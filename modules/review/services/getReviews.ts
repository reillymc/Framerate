import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type ReviewSummary = {
    reviewId: string;
    mediaId: number;
    mediaTitle: string;
    mediaType: string;
    mediaPosterUri: string;
    mediaReleaseDate?: string;
    date?: string;
    rating: number;
    reviewDescription?: string;
};

export type GetReviewsRequest = {
    mediaId?: number;
    orderBy?: "rating" | "date" | "mediaTitle" | "mediaReleaseDate";
    sort?: "asc" | "desc";
    page?: number;
    pageSize?: number;
    ratingMin?: number;
    ratingMax?: number;
    atVenue?: string;
    withCompany?: string;
};

type GetReviews = FramerateService<ReviewSummary[], GetReviewsRequest>;

export const getReviews: GetReviews = async ({ mediaId, session, ...params }) =>
    ExecuteRequest(FRAMERATE_API.reviews.getReviews(mediaId, params), {
        session,
    });
