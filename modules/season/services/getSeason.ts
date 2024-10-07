import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type EpisodeSummary = {
    episodeNumber: number;
    name?: string;
    stillPath?: string;
    overview?: string;
    airDate?: string;
};

export type SeasonDetails = {
    showId: number;
    seasonNumber: number;
    name?: string;
    posterPath?: string;
    overview?: string;
    airDate?: string;
    episodeCount?: number;
    episodes?: Array<EpisodeSummary>;
};

type GetSeasonRequest = {
    showId: number;
    seasonNumber: number;
};

type GetSeason = FramerateService<SeasonDetails, GetSeasonRequest>;

export const getSeason: GetSeason = ({ showId, seasonNumber, session }) =>
    ExecuteRequest(FRAMERATE_API.showSeasons.getSeason(showId, seasonNumber), {
        session,
    });
