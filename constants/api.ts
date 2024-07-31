const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

export const API = {
    reviews: {
        getReviews: (mediaId?: number) =>
            mediaId
                ? `${BASE_URL}/reviews/media/${mediaId}`
                : `${BASE_URL}/reviews`,
        getReview: (id: string) => `${BASE_URL}/reviews/${id}`,
        postReview: `${BASE_URL}/reviews`,
        putReview: (reviewId: string) => `${BASE_URL}/reviews/${reviewId}`,
    },
};

export { TMDB_API_KEY };
