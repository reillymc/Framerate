import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type ShowSearchResult = {
    id: number;
    name: string;
    posterPath?: string;
    backdropPath?: string;
    firstAirDate?: string;
    overview: string;
    popularity: number;
};

type SearchShowsRequest = {
    query: string;
};

type SearchShows = FramerateService<ShowSearchResult[], SearchShowsRequest>;

export const searchShows: SearchShows = ({ query, session }) =>
    ExecuteRequest(FRAMERATE_API.shows.searchShows(query), { session });
