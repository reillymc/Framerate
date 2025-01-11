import { useSession } from "@/modules/auth";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
    useMemo,
} from "react";
import { Configuration, MovieApi, type MovieApiInterface } from "../services";
type ServiceContextType = {
    movies?: MovieApiInterface;
};

const ServiceContext = createContext<ServiceContextType>({
    movies: undefined,
});

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const useFramerateServices = () => useContext(ServiceContext);

export const ServiceProvider: FC<PropsWithChildren> = ({ children }) => {
    const { session } = useSession();

    const services: ServiceContextType = useMemo(() => {
        const movies = new MovieApi(
            new Configuration({
                accessToken: session ?? undefined,
                basePath: BASE_URL,
            }),
        );

        return { movies };
    }, [session]);

    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    );
};
