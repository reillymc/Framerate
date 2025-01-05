import type { Movie } from "@/modules/movie";

export type MovieEntry = {
    movieId: Movie["id"];
    title: Movie["title"];
    imdbId?: Movie["imdbId"];
    posterPath?: Movie["posterPath"];
    releaseDate?: Movie["releaseDate"];
};

export type MovieCollection = {
    collectionId: string;
    name: string;
    entries?: Array<MovieEntry>;
};
