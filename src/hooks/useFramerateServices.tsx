import { createContext, useContext } from "react";

import type {
    AdministrationApiInterface,
    CompanyApiInterface,
    MetaApiInterface,
    MovieApiInterface,
    MovieCollectionApiInterface,
    MovieReviewApiInterface,
    MovieWatchlistApiInterface,
    SeasonApiInterface,
    SeasonReviewApiInterface,
    ShowApiInterface,
    ShowCollectionApiInterface,
    ShowReviewApiInterface,
    ShowWatchlistApiInterface,
    UserApiInterface,
} from "@/services";

export type ServiceContextType = {
    administration: AdministrationApiInterface;
    company: CompanyApiInterface;
    meta: MetaApiInterface;
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
export const ServiceContext = createContext<Partial<ServiceContextType>>({});

export const useFramerateServices = () => useContext(ServiceContext);
