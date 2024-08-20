import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveReviewParams = {
    reviewId?: string;
    mediaId: number;
    mediaType: string;
    date?: string;
    rating: number;
    reviewTitle?: string;
    reviewDescription?: string;
    venue?: string;
    company?: Array<{
        userId: string;
    }>;
};

type SaveReview = (params: SaveReviewParams) => Promise<null>;

export const saveReview: SaveReview = (review) =>
    ExecuteRequest(FRAMERATE_API.reviews.saveReview(review.reviewId), review);
