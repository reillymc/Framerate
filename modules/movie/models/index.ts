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
    credits?: {
        crew: Array<{
            id: number;
            knownForDepartment?: string;
            name?: string;
            popularity: number;
            profilePath?: string;
            creditId?: string;
            department?: string;
            job?: string;
        }>;
        cast: Array<{
            id: number;
            knownForDepartment?: string;
            name?: string;
            popularity: number;
            profilePath?: string;
            castId: number;
            character?: string;
            creditId?: string;
            order: number;
        }>;
    };
};
