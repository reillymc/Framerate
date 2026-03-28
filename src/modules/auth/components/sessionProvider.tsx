import { type FC, type PropsWithChildren, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useStorageState } from "@/hooks/useStorageState";
import {
    AuthenticationApi,
    Configuration,
    LoggerMiddleware,
    type Middleware,
    SignalMiddleware,
} from "@/services";

import { SessionContext } from "../context";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [host, setHost, { loading: isLoadingHost }] = useStorageState("host");
    const [session, setSession, { loading: isLoadingSession }] =
        useStorageState("session");
    const [userId, setUserId, { loading: isLoadingUserId }] =
        useStorageState("userId");

    const queryClient = useQueryClient();

    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    const middleware: Middleware = {
        post: async (context) => {
            if (!context.response?.ok) {
                try {
                    const body = await context.response.json();
                    setError(`${body.message}`);
                } catch {
                    setError("An unknown error occurred");
                }
            }
            return new Promise((resolve) => resolve(context.response));
        },
        onError: (context) => {
            setError("Unable to connect to host");
            return new Promise((resolve) => resolve(context.response));
        },
    };

    const serviceConfiguration = new Configuration({
        basePath: host || BASE_URL,
        middleware: [LoggerMiddleware, SignalMiddleware, middleware],
    });

    const authenticationService = new AuthenticationApi(
        new Configuration(serviceConfiguration),
    );

    return (
        <SessionContext.Provider
            value={{
                host,
                defaultHost: BASE_URL,
                session,
                userId: userId ?? undefined,
                error,
                isLoading: isLoadingHost || isLoadingSession || isLoadingUserId,
                isSigningIn: loading,
                signIn: (authUser) => {
                    setLoading(true);
                    return authenticationService
                        .login({ authUser })
                        .then((response) => {
                            if (!response) return;

                            setSession(response.token);
                            setUserId(response.userId);
                            setError(undefined);
                        })
                        .catch(() => null)
                        .finally(() => {
                            setLoading(false);
                        });
                },
                register: (registeringUser) => {
                    setLoading(true);
                    return authenticationService
                        .register({ registeringUser })
                        .then((response) => {
                            if (!response) return;

                            setSession(response.token);
                            setUserId(response.userId);
                            setError(undefined);
                        })
                        .catch(() => null)
                        .finally(() => {
                            setLoading(false);
                        });
                },
                signOut: () => {
                    setSession(null);
                    setUserId(null);
                    queryClient.clear();
                },
                setHost: (host) => {
                    setHost(host);
                },
                clearError: () => {
                    setError(undefined);
                },
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};
