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
    watchlists: {
        getWatchlists: `${BASE_URL}/watchlists`,
        getWatchlist: (mediaType: string) =>
            `${BASE_URL}/watchlists/${mediaType}`,
        postWatchlist: `${BASE_URL}/watchlists`,
        putWatchlist: (watchlistId: string) =>
            `${BASE_URL}/watchlists/${watchlistId}`,
    },
    watchlistEntries: {
        getWatchlistEntries: (mediaType: string) =>
            `${BASE_URL}/watchlists/${mediaType}/entries`,
        getWatchlistEntry: (mediaType: string, mediaId: number) =>
            `${BASE_URL}/watchlists/${mediaType}/entries/${mediaId}`,
        postWatchlistEntry: (mediaType: string) =>
            `${BASE_URL}/watchlists/${mediaType}/entries`,
        deleteWatchlistEntry: (mediaType: string, mediaId: number) =>
            `${BASE_URL}/watchlists/${mediaType}/entries/${mediaId}`,
    },
    users: {
        getUser: (userId: string) => `${BASE_URL}/users/${userId}`,
        getUsers: () => `${BASE_URL}/users`,
        postUser: () => `${BASE_URL}/users`,
        putUser: (userId: string) => `${BASE_URL}/users/${userId}`,
    },
};

export { TMDB_API_KEY };
