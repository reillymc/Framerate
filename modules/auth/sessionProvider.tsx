import { useStorageState } from "@/hooks/useStorageState";
import { type AuthUser, AuthenticationApi, Configuration } from "@/services";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
} from "react";

const SessionContext = createContext<{
    signIn: (credentials: AuthUser) => void;
    signOut: () => void;
    session: string | null;
    userId: string | undefined;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    userId: undefined,
    isLoading: false,
});

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const authenticationService = new AuthenticationApi(
    new Configuration({ basePath: BASE_URL }),
);

// This hook can be used to access the user info.
export const useSession = () => useContext(SessionContext);

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [[isLoadingSession, session], setSession] =
        useStorageState("session");
    const [[isLoadingUserId, userId], setUserId] = useStorageState("userId");

    return (
        <SessionContext.Provider
            value={{
                signIn: (authUser: AuthUser) =>
                    authenticationService
                        .login({ authUser })
                        .then((response) => {
                            if (!response) return;

                            setSession(response.token);
                            setUserId(response.userId);
                        }),
                signOut: () => {
                    setSession(null);
                    setUserId(null);
                },
                session,
                userId: userId ?? undefined,
                isLoading: isLoadingSession || isLoadingUserId,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
