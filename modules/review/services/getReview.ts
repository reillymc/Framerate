import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type ReviewDetails = {
    reviewId: string;
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
};

type GetReviewRequest = {
    reviewId: string;
};

type GetReview = FramerateService<ReviewDetails, GetReviewRequest>;

export const getReview: GetReview = ({ reviewId, session }) =>
    ExecuteRequest(FRAMERATE_API.reviews.getReview(reviewId), { session });
