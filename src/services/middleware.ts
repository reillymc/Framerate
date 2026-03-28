
import type { Middleware } from "./framerateBackend";

 const LOG_CALLS = process.env.EXPO_PUBLIC_LOG_CALLS;

export const LoggerMiddleware: Middleware = {
    pre: (context) => {
        if (LOG_CALLS) {
            console.debug(context.init.method, context.url);
        }

        return new Promise((resolve) => resolve(context));
    },
    onError: (context) => {
        console.warn(`Network response was not ok for ${context.url}`);
        return new Promise((resolve) => resolve(context.response));
    },
};

export const SignalMiddleware: Middleware = {
    pre: (context) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 3000);
        context.init.signal = controller.signal;

        return new Promise((resolve) => resolve(context));
    },
};
