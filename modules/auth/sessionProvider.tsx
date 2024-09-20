import { useStorageState } from "@/hooks/useStorageState";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
} from "react";
import { AuthService, type LoginRequest } from "./services";

const SessionContext = createContext<{
    signIn: (credentials: LoginRequest) => void;
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

// This hook can be used to access the user info.
export const useSession = () => useContext(SessionContext);

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [[isLoadingSession, session], setSession] =
        useStorageState("session");
    const [[isLoadingUserId, userId], setUserId] = useStorageState("userId");

    return (
        <SessionContext.Provider
            value={{
                signIn: (credentials: LoginRequest) =>
                    AuthService.login({ ...credentials, session: null }).then(
                        (response) => {
                            if (!response) return;

                            setSession(response.token);
                            setUserId(response.userId);
                        },
                    ),
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
