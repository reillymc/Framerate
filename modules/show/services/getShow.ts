import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

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
};

type GetShowRequest = {
    id: number;
};

type GetShow = FramerateService<ShowDetails, GetShowRequest>;

export const getShow: GetShow = ({ id, session }) =>
    ExecuteRequest(FRAMERATE_API.shows.getShow(id), { session });
