import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface ReviewSummary {
    reviewId: string;
    userId: string;
    mediaId: number;
    mediaTitle: string;
    mediaType: string;
    mediaPosterUri: string;
    mediaReleaseDate?: string;
    date?: string;
    rating: number;
    reviewDescription?: string;
}

export type GetReviewParams = {
    mediaId?: number;
    orderBy?: "rating" | "date" | "mediaTitle";
    sort?: "asc" | "desc";
    page?: number;
    pageSize?: number;
    ratingMin?: number;
    ratingMax?: number;
    atVenue?: string;
    withCompany?: string;
};

type GetReviews = (
    params: GetReviewParams,
) => Promise<ReviewSummary[] | undefined>;

export const getReviews: GetReviews = async ({ mediaId, ...params }) =>
    ExecuteRequest(FRAMERATE_API.reviews.getReviews(mediaId, params));
