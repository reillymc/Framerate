import type { Season } from "@/modules/season";

export enum ShowType {
    Scripted = "Scripted",
    Miniseries = "Miniseries",
}

export type ExternalIds = {
    imdbId?: string;
};

export type Show = {
    /**
     * TMDB ID
     */
    id: number;
    name: string;
    posterPath?: string;
    backdropPath?: string;
    firstAirDate?: string;
    lastAirDate?: string;
    nextAirDate?: string;
    overview?: string;
    tagline?: string;
    popularity?: number;
    externalIds?: ExternalIds;
    seasons?: Array<Season>;
};
