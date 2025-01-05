import type { ShowEntry } from "@/modules/showCollection";

export type ShowWatchlist = {
    name: string;
    entries?: Array<ShowEntry>;
};
