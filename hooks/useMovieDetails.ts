import { TMDB_API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import type { SearchItem } from "./useSearch";

type SearhParams = { mediaId?: number };

export interface MovieResponse {
    adult: boolean;
    backdrop_path: string;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

type Movie = {
    mediaId: number;
    title: string;
    poster?: string;
    backdrop?: string;
    year?: number;
    type: "movie";
    releaseDate?: string;
    overview?: string;
    tagline?: string;
    imdbId?: string;
    runtime?: number;
};

const IsMovie = (item: SearchItem): item is Movie => item.type === "movie";

type SearchTmdb = (params: SearhParams) => Promise<Movie | undefined>;

const getTmdbMovieDetails: SearchTmdb = async ({ mediaId }) => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            // biome-ignore lint/style/useNamingConvention: header casing convention
            Authorization: `Bearer ${TMDB_API_KEY}`,
        },
    };

    console.debug("TMDB FETCH: Movie Details -", mediaId);

    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${mediaId}?language=en-AU`,
        options,
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const json = (await response.json()) as MovieResponse;
    return {
        mediaId: json.id,
        title: json.title,
        poster: json.poster_path,
        year: json.release_date
            ? new Date(json.release_date ?? "").getFullYear()
            : undefined,
        releaseDate: json.release_date,
        overview: json.overview,
        type: "movie",
        backdrop: json.backdrop_path,
        imdbId: json.imdb_id,
        tagline: json.tagline,
        runtime: json.runtime,
    };
};

export const useMovieDetails = ({ mediaId }: SearhParams) => {
    return useQuery({
        queryKey: ["movie", mediaId],
        enabled: !!mediaId,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        queryFn: () => getTmdbMovieDetails({ mediaId }),
    });
};
