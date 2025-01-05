import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieEntry } from "../models";

export type SaveMovieCollectionEntryRequest = {
    collectionId: string;
    movieId: number;
};

type SaveMovieCollectionEntry = FramerateService<
    MovieEntry,
    SaveMovieCollectionEntryRequest
>;

export const saveMovieCollectionEntry: SaveMovieCollectionEntry = ({
    session,
    collectionId,
    ...body
}) =>
    ExecuteRequest(FRAMERATE_API.movieCollections.postEntry(collectionId), {
        session,
        body,
    });
