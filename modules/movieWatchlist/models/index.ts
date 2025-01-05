import type { MovieEntry } from "@/modules/movieCollection";

export type MovieWatchlist = {
    name: string;
    entries?: Array<MovieEntry>;
};
