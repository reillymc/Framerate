import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteMovieCollectionEntryResponse = {
    count: number;
};

export type DeleteMovieCollectionEntryRequest = {
    collectionId: string;
    movieId: number;
};

type DeleteMovieCollectionEntry = FramerateService<
    DeleteMovieCollectionEntryResponse,
    DeleteMovieCollectionEntryRequest
>;

export const deleteMovieCollectionEntry: DeleteMovieCollectionEntry = ({
    collectionId,
    movieId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.movieCollections.deleteEntry(collectionId, movieId),
        {
            session,
        },
    );
