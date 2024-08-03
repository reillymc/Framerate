import { API } from "@/constants/api";

export type DeleteWatchlistEntryParams = {
    mediaId: number;
    mediaType: string;
};

type DeleteWatchlistEntry = (
    params: DeleteWatchlistEntryParams,
) => Promise<null>;

export const deleteWatchlistEntry: DeleteWatchlistEntry = async ({
    mediaId,
    mediaType,
}) => {
    try {
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        };

        const response = await fetch(
            API.watchlistEntries.deleteWatchlistEntry(mediaType, mediaId),
            options,
        );

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
};
