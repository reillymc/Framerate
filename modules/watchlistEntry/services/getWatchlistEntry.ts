import { API } from "@/constants/api";

export interface WatchlistEntryDetails {
    watchlistId: string;
    userId: string;
    mediaId: number;
    mediaType: string;
    name: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate: string;
}

type GetWatchlistEntryParams = {
    mediaType: string;
    mediaId: number;
};

type GetWatchlistEntry = (
    params: GetWatchlistEntryParams,
) => Promise<WatchlistEntryDetails | undefined>;

export const getWatchlistEntry: GetWatchlistEntry = async ({
    mediaType,
    mediaId,
}) => {
    try {
        const response = await fetch(
            API.watchlistEntries.getWatchlistEntry(mediaType, mediaId),
        );
        const json = await response.json();
        return json;
    } catch (error) {
        console.warn(error);
        return null;
    }
};
