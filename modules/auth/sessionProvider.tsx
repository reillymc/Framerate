import { useStorageState } from "@/hooks/useStorageState";
import {
    type FC,
    type PropsWithChildren,
    createContext,
    useContext,
} from "react";
import { AuthService, type LoginParams } from "./services";

const SessionContext = createContext<{
    signIn: (credentials: LoginParams) => void;
    signOut: () => void;
    session: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export const useSession = () => useContext(SessionContext);

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [[isLoading, session], setSession] = useStorageState("session");

    return (
        <SessionContext.Provider
            value={{
                signIn: (credentials: LoginParams) =>
                    AuthService.login(credentials).then(setSession),
                signOut: () => setSession(null),
                session,
                isLoading,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
