import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface ReviewSummary {
    reviewId: string;
    userId: string;
    mediaId: number;
    mediaTitle: string;
    mediaType: string;
    mediaPosterUri: string;
    mediaReleaseYear: number;
    date?: string;
    rating: number;
    reviewDescription?: string;
}

type GetReviewParams = {
    mediaId?: number;
};

type GetReviews = (
    params: GetReviewParams,
) => Promise<ReviewSummary[] | undefined>;

export const getReviews: GetReviews = async ({ mediaId }) =>
    ExecuteRequest(FRAMERATE_API.reviews.getReviews(mediaId));
