import { useSession } from "@/modules/auth";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
    useMemo,
} from "react";
import {
    Configuration,
    MovieApi,
    type MovieApiInterface,
    MovieCollectionApi,
    type MovieCollectionApiInterface,
    MovieReviewApi,
    type MovieReviewApiInterface,
    MovieWatchlistApi,
    type MovieWatchlistApiInterface,
    SeasonApi,
    type SeasonApiInterface,
    ShowApi,
    type ShowApiInterface,
} from "../services";
type ServiceContextType = {
    movieCollections: MovieCollectionApiInterface;
    movieReviews: MovieReviewApiInterface;
    movies: MovieApiInterface;
    movieWatchlist: MovieWatchlistApiInterface;
    seasons: SeasonApiInterface;
    shows: ShowApiInterface;
};

const ServiceContext = createContext<Partial<ServiceContextType>>({});

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const useFramerateServices = () => useContext(ServiceContext);

export const ServiceProvider: FC<PropsWithChildren> = ({ children }) => {
    const { session } = useSession();

    const services: ServiceContextType = useMemo(() => {
        const serviceConfiguration = new Configuration({
            accessToken: session ?? undefined,
            basePath: BASE_URL,
        });

        return {
            movieCollections: new MovieCollectionApi(serviceConfiguration),
            movieReviews: new MovieReviewApi(serviceConfiguration),
            movies: new MovieApi(serviceConfiguration),
            movieWatchlist: new MovieWatchlistApi(serviceConfiguration),
            seasons: new SeasonApi(serviceConfiguration),
            shows: new ShowApi(serviceConfiguration),
        };
    }, [session]);

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};
