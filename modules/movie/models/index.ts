export type Movie = {
    /**
     * TMDB ID
     */
    id: number;
    title: string;
    imdbId?: string;
    posterPath?: string;
    backdropPath?: string;
    releaseDate?: string;
    overview?: string;
    tagline?: string;
    popularity?: number;
    runtime?: number;
};
