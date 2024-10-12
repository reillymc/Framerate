export type ApiDefinition = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    endpoint: string;
};

type Api = {
    [namespace: string]: {
        [method: string]: (...params: never) => ApiDefinition;
    };
};

export type BaseRequestParams = {
    session: string | null;
};

export type FramerateResponse = {
    message?: string;
    data?: unknown;
};

export type FramerateService<
    // biome-ignore lint/style/useNamingConvention: Generic type naming convention
    TResponse extends
        | Record<string, string | number | object>
        | Array<Record<string, string | number | object | undefined>>,
    // biome-ignore lint/style/useNamingConvention: Generic type naming convention
    // biome-ignore lint/complexity/noBannedTypes: Default value
    TRequest extends Record<string, string | number | object> = {},
> = (params: BaseRequestParams & TRequest) => Promise<TResponse | null>;

type ReviewQueryParams = {
    orderBy?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
    ratingMin?: number;
    ratingMax?: number;
    atVenue?: string;
};

const recordToParams = (record?: Record<string, string | number>) => {
    if (!record) return "";

    const query = Object.entries(record)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    return `?${query}`;
};

export const FRAMERATE_API = {
    auth: {
        login: () => ({
            method: "POST",
            endpoint: "auth/login",
        }),
    },
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
    movieReviews: {
        getReviews: (movieId?: number, params?: ReviewQueryParams) => ({
            method: "GET",
            endpoint: movieId
                ? `movies/reviews/movie/${movieId}`
                : `movies/reviews${recordToParams(params)}`,
        }),
        getReview: (id: string) => ({
            method: "GET",
            endpoint: `movies/reviews/review/${id}`,
        }),
        saveReview: (reviewId?: string) => ({
            method: reviewId ? "PUT" : "POST",
            endpoint: reviewId
                ? `movies/reviews/review/${reviewId}`
                : "movies/reviews",
        }),
    },
    shows: {
        getShow: (showId: number) => ({
            method: "GET",
            endpoint: `shows/${showId}/details`,
        }),
        getPopularShows: () => ({
            method: "GET",
            endpoint: "shows/popular",
        }),
        searchShows: (query: string) => ({
            method: "GET",
            endpoint: `shows/search?query=${query}`,
        }),
    },
    showReviews: {
        getReviews: (showId?: number, params?: ReviewQueryParams) => ({
            method: "GET",
            endpoint: showId
                ? `shows/reviews/show/${showId}`
                : `shows/reviews${recordToParams(params)}`,
        }),
        getReview: (id: string) => ({
            method: "GET",
            endpoint: `shows/reviews/review/${id}`,
        }),
        saveReview: (reviewId?: string) => ({
            method: reviewId ? "PUT" : "POST",
            endpoint: reviewId
                ? `shows/reviews/review/${reviewId}`
                : "shows/reviews",
        }),
    },
    showSeasons: {
        getSeason: (showId: number, seasonNumber: number) => ({
            method: "GET",
            endpoint: `shows/${showId}/seasons/${seasonNumber}`,
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
