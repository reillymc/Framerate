import { API } from "@/constants/api";

export interface ReviewSummary {
    reviewId: string;
    userId: string;
    mediaId: number;
    mediaTitle: string;
    mediaType: string;
    mediaPosterUri: string;
    mediaReleaseYear: number;
    date: string;
    rating: number;
    reviewTitle?: string;
}

type GetReviewParams = {
    mediaId?: number;
};

type GetReviews = (
    params: GetReviewParams,
) => Promise<ReviewSummary[] | undefined>;

export const getReviews: GetReviews = async ({ mediaId }) => {
    console.log(API.reviews.getReviews(mediaId));

    try {
        const response = await fetch(API.reviews.getReviews(mediaId));
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};
