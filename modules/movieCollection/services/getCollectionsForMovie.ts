import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieCollection, MovieEntry } from "../models";

type GetCollectionsForMovieResponse = Array<MovieCollection["collectionId"]>;

type GetCollectionsForMovieRequest = Pick<MovieEntry, "movieId">;

type GetCollectionsForMovie = FramerateService<
    GetCollectionsForMovieResponse,
    GetCollectionsForMovieRequest
>;

export const getCollectionsForMovie: GetCollectionsForMovie = ({
    movieId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.movieCollections.getCollectionsForMovie(movieId),
        { session },
    );
