import { isBefore } from "date-fns";
import type { ShowWatchlistEntry } from "../models";

export const SortEntriesByNextAirDate = (
    a: ShowWatchlistEntry,
    b: ShowWatchlistEntry,
) => {
    if (!a.nextAirDate) return -1;
    if (!b.nextAirDate) return 1;
    return isBefore(a.nextAirDate, b.nextAirDate) ? 1 : -1;
};
export const SortEntriesByLastAirDate = (
    a: ShowWatchlistEntry,
    b: ShowWatchlistEntry,
) => {
    if (!a.lastAirDate) return -1;
    if (!b.lastAirDate) return 1;
    return isBefore(a.lastAirDate, b.lastAirDate) ? 1 : -1;
};
