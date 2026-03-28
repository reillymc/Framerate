import { type FC, type PropsWithChildren, useMemo } from "react";

import { ServiceContext, type ServiceContextType } from "@/hooks";
import { useSession } from "@/modules/auth";

import {
    AdministrationApi,
    CompanyApi,
    Configuration,
    LoggerMiddleware,
    MetaApi,
    MovieApi,
    MovieCollectionApi,
    MovieReviewApi,
    MovieWatchlistApi,
    SeasonApi,
    SeasonReviewApi,
    ShowApi,
    ShowCollectionApi,
    ShowReviewApi,
    ShowWatchlistApi,
    SignalMiddleware,
    UserApi,
} from "../services";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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
            meta: new MetaApi(serviceConfiguration),
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
