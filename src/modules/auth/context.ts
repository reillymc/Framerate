import { createContext } from "react";

import type { AuthUser, RegisteringUser } from "@/services";

export const SessionContext = createContext<{
    signIn: (credentials: AuthUser) => void;
    register: (credentials: RegisteringUser) => void;
    signOut: () => void;
    setHost: (host: string) => void;
    clearError: () => void;
    host: string | null;
    defaultHost: string | undefined;
    session: string | null;
    userId: string | undefined;
    isLoading: boolean;
    isSigningIn: boolean;
    error: string | undefined;
}>({
    signIn: () => null,
    register: () => null,
    signOut: () => null,
    setHost: () => null,
    clearError: () => null,
    host: null,
    defaultHost: undefined,
    session: null,
    userId: undefined,
    isLoading: false,
    isSigningIn: false,
    error: undefined,
});
