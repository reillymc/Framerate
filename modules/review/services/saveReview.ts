import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveReviewResponse = {
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

export type SaveReviewRequest = {
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

type SaveReview = FramerateService<SaveReviewResponse, SaveReviewRequest>;

export const saveReview: SaveReview = ({ session, ...body }) =>
    ExecuteRequest(FRAMERATE_API.reviews.saveReview(body.reviewId), {
        session,
        body,
    });
