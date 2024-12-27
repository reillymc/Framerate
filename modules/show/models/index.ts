import type { Season } from "@/modules/season";
import type { ShowStatus } from "../constants";

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
    status?: ShowStatus;
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
    credits?: {
        crew: Array<{
            id: number;
            knownForDepartment?: string;
            name?: string;
            popularity: number;
            profilePath?: string;
            totalEpisodeCount?: number;
            department?: string;
            jobs?: Array<{
                job: string;
                episodeCount: number;
            }>;
        }>;
        cast: Array<{
            id: number;
            knownForDepartment?: string;
            name?: string;
            popularity: number;
            profilePath?: string;
            totalEpisodeCount?: number;
            roles?: Array<{
                character: string;
                episodeCount: number;
            }>;
        }>;
    };
};
