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
    ShowApi,
    type ShowApiInterface,
} from "../services";
type ServiceContextType = {
    movies: MovieApiInterface | undefined;
    shows: ShowApiInterface | undefined;
};

const ServiceContext = createContext<ServiceContextType>({
    movies: undefined,
    shows: undefined,
});

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

        return { movies, shows };
    }, [session]);

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};
