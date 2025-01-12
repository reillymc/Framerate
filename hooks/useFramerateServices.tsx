import { LOG_CALLS } from "@/constants/api";
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
    type Middleware,
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
    ShowCollectionApi,
    type ShowCollectionApiInterface,
    ShowWatchlistApi,
    type ShowWatchlistApiInterface,
} from "../services";

type ServiceContextType = {
    movieCollections: MovieCollectionApiInterface;
    movieReviews: MovieReviewApiInterface;
    movies: MovieApiInterface;
    movieWatchlist: MovieWatchlistApiInterface;
    seasons: SeasonApiInterface;
    showCollections: ShowCollectionApiInterface;
    shows: ShowApiInterface;
    showWatchlist: ShowWatchlistApiInterface;
};

const LoggerMiddleware: Middleware = {
    pre: (context) => {
        if (LOG_CALLS) {
            console.debug(context.init.method, context.url);
        }

        return new Promise((resolve) => resolve(context));
    },
    onError: (context) => {
        console.warn(`Network response was not ok for ${context.url}`);
        return new Promise((resolve) => resolve(context.response));
    },
};

const SignalMiddleware: Middleware = {
    pre: (context) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 3000);
        context.init.signal = controller.signal;

        return new Promise((resolve) => resolve(context));
    },
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
            middleware: [LoggerMiddleware, SignalMiddleware],
        });

        return {
            movieCollections: new MovieCollectionApi(serviceConfiguration),
            movieReviews: new MovieReviewApi(serviceConfiguration),
            movies: new MovieApi(serviceConfiguration),
            movieWatchlist: new MovieWatchlistApi(serviceConfiguration),
            seasons: new SeasonApi(serviceConfiguration),
            showCollections: new ShowCollectionApi(serviceConfiguration),
            shows: new ShowApi(serviceConfiguration),
            showWatchlist: new ShowWatchlistApi(serviceConfiguration),
        };
    }, [session]);

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};
