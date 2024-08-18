import { TMDB_API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

type UseRecipesParams = { searchValue?: string };

export interface SearchResponse {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
}

export interface Result {
    backdrop_path?: string;
    id: number;
    name?: string;
    original_name?: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    origin_country?: string[];
    title?: string;
    original_title?: string;
    release_date?: string;
    video?: boolean;
}

export type SearchItem = {
    mediaId: number;
    title: string;
    poster?: string;
    year?: number;
    type: "movie" | "tv";
    overview?: string;
};

type SearchTmdb = (
    params: UseRecipesParams,
) => Promise<Array<SearchItem> | undefined>;

const searchTmdb: SearchTmdb = async ({ searchValue }) => {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            // biome-ignore lint/style/useNamingConvention: header casing convention
            Authorization: `Bearer ${TMDB_API_KEY}`,
        },
    };

    console.debug("TMDB FETCH: Search Movies - ", searchValue);

    const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${searchValue}&language=en-AU&page=1`,
        options,
    );

    const json = (await response.json()) as SearchResponse;

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return json.results
        .filter(({ media_type }) => ["tv", "movie"].includes(media_type))
        .map((result) => ({
            mediaId: result.id,
            title: result.title ?? result.name ?? "",
            poster: result.poster_path,
            year:
                result.release_date || result.first_air_date
                    ? new Date(
                          result.release_date ?? result.first_air_date ?? "",
                      ).getFullYear()
                    : undefined,
            overview: result.overview,
            type: result.media_type === "movie" ? "movie" : "tv",
        }));
};

export const useSearch = ({ searchValue: searchParam }: UseRecipesParams) => {
    const search = useDebounce(searchParam, 400);

    return useQuery({
        queryKey: ["search", search],
        enabled: !!search?.length,
        queryFn: () => searchTmdb({ searchValue: search }),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};
