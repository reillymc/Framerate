import { TMDB_API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { addWeeks, subMonths } from "date-fns";

export interface SearchResponse {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
}

export interface Result {
    backdrop_path: string;
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: string[];
}

export type SearchItem = {
    mediaId: number;
    title: string;
    poster?: string;
    year?: number;
    popularity?: number;
    type: "movie" | "tv";
    overview?: string;
};

type GetTmdbPopularShows = () => Promise<Array<SearchItem> | undefined>;

const getTmdbPopularShows: GetTmdbPopularShows = async () => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            // biome-ignore lint/style/useNamingConvention: header casing convention
            Authorization: `Bearer ${TMDB_API_KEY}`,
        },
    };

    console.debug("TMDB FETCH: Popular Shows");

    const minDate = subMonths(new Date(), 2);

    const maxDate = addWeeks(new Date(), 1);

    const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&air_date.lte=${maxDate}&air_date.gte=${minDate}&timezone=Australia/Brisbane`,
        options,
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const json = (await response.json()) as SearchResponse;

    return json.results.map((result) => ({
        mediaId: result.id,
        title: result.name,
        poster: result.poster_path,
        overview: result.overview,
        popularity: result.popularity,
        type: "tv",
    }));
};

export const usePopularShows = () => {
    return useQuery({
        queryKey: ["popularShows"],
        queryFn: () => getTmdbPopularShows(),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};
