import { API } from "@/constants/api";

export type SaveWatchlistEntryParams = {
    mediaId: number;
    mediaType: string;
    imdbId: string | undefined;
    mediaTitle: string;
    mediaPosterUri: string | undefined;
    mediaReleaseDate: string | undefined;
};

type SaveWatchlistEntry = (params: SaveWatchlistEntryParams) => Promise<null>;

export const saveWatchlistEntry: SaveWatchlistEntry = async (
    watchlistEntry,
) => {
    try {
        const options = {
            method: "POST",
            body: JSON.stringify(watchlistEntry),
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        };

        const response = await fetch(
            API.watchlistEntries.postWatchlistEntry(watchlistEntry.mediaType),
            options,
        );

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
};
