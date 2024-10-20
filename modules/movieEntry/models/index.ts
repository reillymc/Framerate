import type { Movie } from "@/modules/movie";

export type MovieEntry = {
    movieId: Movie["id"];
    title: Movie["title"];
    imdbId?: Movie["imdbId"];
    posterPath?: Movie["posterPath"];
    releaseDate?: Movie["releaseDate"];
};

// TODO: remove when multiple lists are supported
export const watchlistId = "default" as const;
