import { useStorageState } from "@/hooks/useStorageState";
import {
    type AuthUser,
    AuthenticationApi,
    Configuration,
    LoggerMiddleware,
    type Middleware,
    SignalMiddleware,
} from "@/services";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

const SessionContext = createContext<{
    signIn: (credentials: AuthUser) => void;
    signOut: () => void;
    setHost: (host: string) => void;
    host: string | null;
    session: string | null;
    userId: string | undefined;
    isLoading: boolean;
    error: string | undefined;
}>({
    signIn: () => null,
    signOut: () => null,
    setHost: () => null,
    host: null,
    session: null,
    userId: undefined,
    isLoading: false,
    error: undefined,
});

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// This hook can be used to access the user info.
export const useSession = () => useContext(SessionContext);

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [host, setHost, { loading: isLoadingHost }] = useStorageState("host");
    const [session, setSession, { loading: isLoadingSession }] =
        useStorageState("session");
    const [userId, setUserId, { loading: isLoadingUserId }] =
        useStorageState("userId");

    const [error, setError] = useState<string>();

    const middleware: Middleware = useMemo(
        () => ({
            post: (context) => {
                if (context.response?.status === 401) {
                    setError("Invalid email or password");
                } else {
                    setError("An unknown error occurred");
                }
                return new Promise((resolve) => resolve(context.response));
            },
            onError: (context) => {
                setError("Unable to connect to host");
                return new Promise((resolve) => resolve(context.response));
            },
        }),
        [],
    );

    const authenticationService = useMemo(() => {
        const serviceConfiguration = new Configuration({
            basePath: host || BASE_URL,
            middleware: [LoggerMiddleware, SignalMiddleware, middleware],
        });
        return new AuthenticationApi(new Configuration(serviceConfiguration));
    }, [host, middleware]);

    return (
        <SessionContext.Provider
            value={{
                host,
                session,
                userId: userId ?? undefined,
                error,
                isLoading: isLoadingHost || isLoadingSession || isLoadingUserId,
                signIn: (authUser: AuthUser) =>
                    authenticationService
                        .login({ authUser })
                        .then((response) => {
                            if (!response) return;

                            setSession(response.token);
                            setUserId(response.userId);
                            setError(undefined);
                        }),
                signOut: () => {
                    setSession(null);
                    setUserId(null);
                },
                setHost: (host) => {
                    setHost(host);
                },
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
