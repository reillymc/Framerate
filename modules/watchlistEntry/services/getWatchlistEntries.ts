import { API } from "@/constants/api";

export interface WatchlistEntrySummary {
    watchlistId: string;
    userId: string;
    mediaId: number;
    mediaType: string;
    name: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate: string;
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
    try {
        const response = await fetch(
            API.watchlistEntries.getWatchlistEntries(mediaType),
        );
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
};
