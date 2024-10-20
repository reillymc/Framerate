import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowEntry } from "../models";

type GetShowEntriesRequest = {
    watchlistId: string;
};

type GetShowEntries = FramerateService<ShowEntry[], GetShowEntriesRequest>;

export const getShowEntries: GetShowEntries = ({ watchlistId, session }) =>
    ExecuteRequest(FRAMERATE_API.showEntries.getEntries(watchlistId), {
        session,
    });
