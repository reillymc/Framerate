import { API } from "@/constants/api";

export type SaveReviewParams = {
    reviewId?: string;
    mediaId: number;
    imdbId?: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri: string;
    mediaReleaseYear: number;
    date?: string;
    rating: number;
    reviewTitle?: string;
    reviewDescription?: string;
    venue?: string;
};

type SaveReview = (params: SaveReviewParams) => Promise<null>;

export const saveReview: SaveReview = async (review) => {
    try {
        const options = {
            method: review.reviewId ? "PUT" : "POST",
            body: JSON.stringify(review),
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        };

        const response = await fetch(
            review.reviewId
                ? API.reviews.putReview(review.reviewId)
                : API.reviews.postReview,
            options,
        );

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
};
