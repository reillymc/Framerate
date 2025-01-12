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
    SeasonApi,
    type SeasonApiInterface,
    ShowApi,
    type ShowApiInterface,
} from "../services";
type ServiceContextType = {
    movies: MovieApiInterface;
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

        const movies = new MovieApi(serviceConfiguration);
        const shows = new ShowApi(serviceConfiguration);
        const seasons = new SeasonApi(serviceConfiguration);

        return { movies, shows, seasons };
    }, [session]);

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};
