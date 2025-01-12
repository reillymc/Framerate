import type { ShowEntry } from "@/modules/showCollection";
import { isBefore } from "date-fns";

export const SortEntriesByNextAirDate = (a: ShowEntry, b: ShowEntry) => {
    if (!a.nextAirDate) return -1;
    if (!b.nextAirDate) return 1;
    return isBefore(a.nextAirDate, b.nextAirDate) ? 1 : -1;
};
export const SortEntriesByLastAirDate = (a: ShowEntry, b: ShowEntry) => {
    if (!a.lastAirDate) return -1;
    if (!b.lastAirDate) return 1;
    return isBefore(a.lastAirDate, b.lastAirDate) ? 1 : -1;
};
