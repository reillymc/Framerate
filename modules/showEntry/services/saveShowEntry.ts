import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowEntry } from "../models";

export type SaveShowEntryRequest = {
    watchlistId: string;
    showId: number;
};

type SaveShowEntry = FramerateService<ShowEntry, SaveShowEntryRequest>;

export const saveShowEntry: SaveShowEntry = ({
    session,
    watchlistId,
    ...body
}) =>
    ExecuteRequest(FRAMERATE_API.showEntries.postEntry(watchlistId), {
        session,
        body,
    });
