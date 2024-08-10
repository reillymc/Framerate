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
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000); // abort after 3 seconds
    const options = {
        method: "POST",
        body: JSON.stringify(watchlistEntry),
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        signal: controller.signal,
    };

    const response = await fetch(
        API.watchlistEntries.postWatchlistEntry(watchlistEntry.mediaType),
        options,
    );

    return response.json();
};
