import { API } from "@/constants/api";

export interface WatchlistEntrySummary {
    watchlistId: string;
    mediaId: number;
    imdbId?: string;
    userId: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
}

type GetWatchlistEntriesParams = {
    mediaType: string;
};

type GetWatchlistEntries = (
    params: GetWatchlistEntriesParams,
) => Promise<WatchlistEntrySummary[] | undefined>;

export const getWatchlistEntries: GetWatchlistEntries = async ({
    mediaType,
}) => {
    const response = await fetch(
        API.watchlistEntries.getWatchlistEntries(mediaType),
    );
    const json = await response.json();
    return json;
};
