import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface ReviewDetails {
    reviewId: string;
    userId: string;
    mediaId: number;
    imdbId?: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
    date?: string;
    rating: number;
    reviewTitle?: string;
    reviewDescription?: string;
    venue?: string;
    company?: Array<{
        userId: string;
        firstName?: string;
        lastName?: string;
    }>;
}

type GetReviewParams = {
    reviewId: string;
};

type GetReview = (
    params: GetReviewParams,
) => Promise<ReviewDetails | undefined>;

export const getReview: GetReview = ({ reviewId }) =>
    ExecuteRequest(FRAMERATE_API.reviews.getReview(reviewId));
