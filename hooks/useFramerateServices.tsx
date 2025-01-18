import { useSession } from "@/modules/auth";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
    useMemo,
} from "react";
import {
    AdministrationApi,
    type AdministrationApiInterface,
    CompanyApi,
    type CompanyApiInterface,
    Configuration,
    LoggerMiddleware,
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
    SeasonReviewApi,
    type SeasonReviewApiInterface,
    ShowApi,
    type ShowApiInterface,
    ShowCollectionApi,
    type ShowCollectionApiInterface,
    ShowReviewApi,
    type ShowReviewApiInterface,
    ShowWatchlistApi,
    type ShowWatchlistApiInterface,
    SignalMiddleware,
    UserApi,
    type UserApiInterface,
} from "../services";

type ServiceContextType = {
    administration: AdministrationApiInterface;
    company: CompanyApiInterface;
    movieCollections: MovieCollectionApiInterface;
    movieReviews: MovieReviewApiInterface;
    movies: MovieApiInterface;
    movieWatchlist: MovieWatchlistApiInterface;
    seasonReviews: SeasonReviewApiInterface;
    seasons: SeasonApiInterface;
    showCollections: ShowCollectionApiInterface;
    showReviews: ShowReviewApiInterface;
    shows: ShowApiInterface;
    showWatchlist: ShowWatchlistApiInterface;
    users: UserApiInterface;
};

const ServiceContext = createContext<Partial<ServiceContextType>>({});

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const useFramerateServices = () => useContext(ServiceContext);

export const ServiceProvider: FC<PropsWithChildren> = ({ children }) => {
    const { session, host } = useSession();

    const services: ServiceContextType = useMemo(() => {
        const serviceConfiguration = new Configuration({
            accessToken: session || undefined,
            basePath: host || BASE_URL,
            middleware: [LoggerMiddleware, SignalMiddleware],
        });

        return {
            administration: new AdministrationApi(serviceConfiguration),
            company: new CompanyApi(serviceConfiguration),
            movieCollections: new MovieCollectionApi(serviceConfiguration),
            movieReviews: new MovieReviewApi(serviceConfiguration),
            movies: new MovieApi(serviceConfiguration),
            movieWatchlist: new MovieWatchlistApi(serviceConfiguration),
            seasonReviews: new SeasonReviewApi(serviceConfiguration),
            seasons: new SeasonApi(serviceConfiguration),
            showCollections: new ShowCollectionApi(serviceConfiguration),
            showReviews: new ShowReviewApi(serviceConfiguration),
            shows: new ShowApi(serviceConfiguration),
            showWatchlist: new ShowWatchlistApi(serviceConfiguration),
            users: new UserApi(serviceConfiguration),
        };
    }, [session, host]);

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};
