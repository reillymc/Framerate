import { API } from "@/constants/api";

export interface ReviewDetails {
    reviewId: string;
    userId: string;
    mediaId: number;
    imdbId?: number;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseYear: number;
    date?: string;
    rating: number;
    reviewTitle?: string;
    reviewDescription?: string;
    venue?: string;
}

type GetReviewParams = {
    reviewId: string;
};

type GetReview = (
    params: GetReviewParams,
) => Promise<ReviewDetails | undefined>;

export const getReview: GetReview = async ({ reviewId }) => {
    try {
        const response = await fetch(API.reviews.getReview(reviewId));
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return;
    }
};
