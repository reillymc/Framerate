import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowEntry } from "../models";

type GetShowEntryRequest = {
    watchlistId: string;
    showId: number;
};

type GetShowEntry = FramerateService<ShowEntry, GetShowEntryRequest>;

export const getShowEntry: GetShowEntry = ({ showId, watchlistId, session }) =>
    ExecuteRequest(
        FRAMERATE_API.showEntries.getEntry(watchlistId, showId),
        // It is expected that a 404 error will be returned if the entry does not exist
        { session, silenceWarnings: [404] },
    );
