import type { Movie } from "@/modules/movie";
import type { Review } from "@/modules/review";

export type MovieReview = Review & {
    movie: Movie;
};
