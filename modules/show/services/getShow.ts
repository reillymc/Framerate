import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SeasonSummary = {
    seasonNumber: number;
    name?: string;
    posterPath?: string;
    overview?: string;
    airDate?: string;
    episodeCount?: number;
};

export type ShowDetails = {
    // TMDB ID
    id: number;
    name: string;
    posterPath?: string;
    backdropPath?: string;
    firstAirDate?: string;
    overview?: string;
    tagline?: string;
    popularity: number;
    externalIds: {
        imdbId?: string;
    };
    seasons?: Array<SeasonSummary>;
};

type GetShowRequest = {
    id: number;
};

type GetShow = FramerateService<ShowDetails, GetShowRequest>;

export const getShow: GetShow = ({ id, session }) =>
    ExecuteRequest(FRAMERATE_API.shows.getShow(id), { session });
