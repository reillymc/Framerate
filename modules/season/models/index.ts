export type Episode = {
    episodeNumber: number;
    name?: string;
    stillPath?: string;
    overview?: string;
    airDate?: string;
};

export type Season = {
    showId: number;
    seasonNumber: number;
    name?: string;
    posterPath?: string;
    overview?: string;
    airDate?: string;
    episodeCount?: number;
    episodes?: Array<Episode>;
};
