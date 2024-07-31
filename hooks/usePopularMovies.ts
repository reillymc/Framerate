import { TMDB_API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";

export interface SearchResponse {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
}

export interface Result {
    id: number;
    backdrop_path?: string;
    name?: string;
    overview?: string;
    popularity?: number;
    poster_path: string;
    release_date?: string;
    title?: string;
    vote_average?: number;
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

type GetTmdbPopularMovies = () => Promise<Array<SearchItem> | undefined>;

const getTmdbPopularMovies: GetTmdbPopularMovies = async () => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            // biome-ignore lint/style/useNamingConvention: header casing convention
            Authorization: `Bearer ${TMDB_API_KEY}`,
        },
    };

    const minDate = subDays(new Date(), 5);

    const maxDate = addDays(new Date(), 10);

    try {
        const response = await fetch(
            // "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&region=AU&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte=${minDate}&release_date.lte=${maxDate}`,
            options,
        );

        const json = (await response.json()) as SearchResponse;
        console.log(json);

        return json.results.map((result) => ({
            mediaId: result.id,
            title: result.title ?? result.name ?? "",
            poster: result.poster_path,

            overview: result.overview,
            popularity: result.popularity,
            type: "movie",
        }));
    } catch (error) {
        console.error(error);
        return;
    }
};

export const usePopularMovies = () => {
    return useQuery({
        queryKey: ["popularMovies"],
        queryFn: () => getTmdbPopularMovies(),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};
