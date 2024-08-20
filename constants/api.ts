export type ApiDefinition = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    endpoint: string;
};

type Api = {
    [namespace: string]: {
        [method: string]: (...params: never) => ApiDefinition;
    };
};

export const FRAMERATE_API = {
    movies: {
        getMovie: (movieId: number) => ({
            method: "GET",
            endpoint: `movies/details/${movieId}`,
        }),
        getPopularMovies: () => ({
            method: "GET",
            endpoint: "movies/popular",
        }),
        searchMovies: (query: string) => ({
            method: "GET",
            endpoint: `movies/search?query=${query}`,
        }),
    },
    reviews: {
        getReviews: (mediaId?: number) => ({
            method: "GET",
            endpoint: mediaId ? `reviews/media/${mediaId}` : "reviews",
        }),
        getReview: (id: string) => ({
            method: "GET",
            endpoint: `reviews/${id}`,
        }),
        saveReview: (reviewId?: string) => ({
            method: reviewId ? "PUT" : "POST",
            endpoint: reviewId ? `reviews/${reviewId}` : "reviews",
        }),
    },
    users: {
        getUser: (userId: string) => ({
            method: "GET",
            endpoint: `users/${userId}`,
        }),
        getUsers: () => ({
            method: "GET",
            endpoint: "users",
        }),
        saveUser: (userId?: string) => ({
            method: userId ? "PUT" : "POST",
            endpoint: userId ? `users/${userId}` : "users",
        }),
    },
    watchlists: {
        getWatchlists: () => ({
            method: "GET",
            endpoint: "watchlists",
        }),
        getWatchlist: (mediaType: string) => ({
            method: "GET",
            endpoint: `watchlists/${mediaType}`,
        }),
        saveWatchlist: (watchlistId?: string) => ({
            method: watchlistId ? "PUT" : "POST",
            endpoint: watchlistId ? `watchlists/${watchlistId}` : "watchlists",
        }),
    },
    watchlistEntries: {
        getWatchlistEntries: (mediaType: string) => ({
            method: "GET",
            endpoint: `watchlists/${mediaType}/entries`,
        }),
        getWatchlistEntry: (mediaType: string, mediaId: number) => ({
            method: "GET",
            endpoint: `watchlists/${mediaType}/entries/${mediaId}`,
        }),
        postWatchlistEntry: (mediaType: string) => ({
            method: "POST",
            endpoint: `watchlists/${mediaType}/entries`,
        }),
        deleteWatchlistEntry: (mediaType: string, mediaId: number) => ({
            method: "DELETE",
            endpoint: `watchlists/${mediaType}/entries/${mediaId}`,
        }),
    },
} satisfies Api;
