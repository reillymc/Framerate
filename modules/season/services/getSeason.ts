import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Season } from "../models";

type GetSeasonRequest = {
    showId: number;
    seasonNumber: number;
};

type GetSeason = FramerateService<Season, GetSeasonRequest>;

export const getSeason: GetSeason = ({ showId, seasonNumber, session }) =>
    ExecuteRequest(FRAMERATE_API.seasons.getSeason(showId, seasonNumber), {
        session,
    });
