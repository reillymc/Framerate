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
    company: {
        getCompany: () => ({
            method: "GET",
            endpoint: "company",
        }),
        saveCompany: (userId?: string) => ({
            method: userId ? "PUT" : "POST",
            endpoint: userId ? `company/${userId}` : "company",
        }),
        deleteCompany: (userId: string) => ({
            method: "DELETE",
            endpoint: `company/${userId}`,
        }),
    },
    movies: {
        getMovie: (movieId: number) => ({
            method: "GET",
            endpoint: `movies/${movieId}/details`,
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
    movieEntries: {
        getEntries: (watchlistId: string) => ({
            method: "GET",
            endpoint: `movies/entries/${watchlistId}`,
        }),
        getEntry: (watchlistId: string, movieId: number) => ({
            method: "GET",
            endpoint: `movies/entries/${watchlistId}/${movieId}`,
        }),
        postEntry: (watchlistId: string) => ({
            method: "POST",
            endpoint: `movies/entries/${watchlistId}`,
        }),
        deleteEntry: (watchlistId: string, movieId: number) => ({
            method: "DELETE",
            endpoint: `movies/entries/${watchlistId}/${movieId}`,
        }),
    },
    movieReviews: {
        getReviews: (movieId?: number, params?: ReviewQueryParams) => ({
            method: "GET",
            endpoint: movieId
                ? `movies/${movieId}/reviews`
                : `movies/reviews${recordToParams(params)}`,
        }),
        getReview: (id: string) => ({
            method: "GET",
            endpoint: `movies/reviews/${id}`,
        }),
        saveReview: (movieId: number, reviewId?: string) => ({
            method: reviewId ? "PUT" : "POST",
            endpoint: reviewId
                ? `movies/${movieId}/reviews/${reviewId}`
                : `movies/${movieId}/reviews`,
        }),
    },
    seasons: {
        getSeason: (showId: number, seasonNumber: number) => ({
            method: "GET",
            endpoint: `shows/${showId}/seasons/${seasonNumber}/details`,
        }),
    },
    seasonReviews: {
        getReviews: (showId: number, seasonNumber: number) => ({
            method: "GET",
            endpoint: `shows/${showId}/seasons/${seasonNumber}/reviews`,
        }),
        getReview: (id: string) => ({
            method: "GET",
            endpoint: `shows/seasons/reviews/${id}`,
        }),
        saveReview: (
            showId: number,
            seasonNumber: number,
            reviewId?: string,
        ) => ({
            method: reviewId ? "PUT" : "POST",
            endpoint: reviewId
                ? `shows/${showId}/seasons/${seasonNumber}/reviews/${reviewId}`
                : `shows/${showId}/seasons/${seasonNumber}/reviews`,
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
    showEntries: {
        getEntries: (watchlistId: string) => ({
            method: "GET",
            endpoint: `shows/entries/${watchlistId}`,
        }),
        getEntry: (watchlistId: string, showId: number) => ({
            method: "GET",
            endpoint: `shows/entries/${watchlistId}/${showId}`,
        }),
        postEntry: (watchlistId: string) => ({
            method: "POST",
            endpoint: `shows/entries/${watchlistId}`,
        }),
        deleteEntry: (watchlistId: string, showId: number) => ({
            method: "DELETE",
            endpoint: `shows/entries/${watchlistId}/${showId}`,
        }),
    },
    showReviews: {
        getReviews: (showId?: number, params?: ReviewQueryParams) => ({
            method: "GET",
            endpoint: showId
                ? `shows/${showId}/reviews`
                : `shows/reviews${recordToParams(params)}`,
        }),
        getReview: (id: string) => ({
            method: "GET",
            endpoint: `shows/reviews/${id}`,
        }),
        saveReview: (showId: number, reviewId?: string) => ({
            method: reviewId ? "PUT" : "POST",
            endpoint: reviewId
                ? `shows/${showId}/reviews/${reviewId}`
                : `shows/${showId}/reviews`,
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
} satisfies Api;
