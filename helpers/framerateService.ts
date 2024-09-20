import type { ApiDefinition, FramerateResponse } from "@/constants/api";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const LOG_CALLS = process.env.EXPO_PUBLIC_LOG_CALLS;

type RequestOptions = {
    session: string | null;
    body?: Record<string, unknown>;
    silenceWarnings?: [404];
    // biome-ignore lint/suspicious/noExplicitAny: unknown value
    processor?: (data: any) => any;
};

export const ExecuteRequest = async (
    { method, endpoint }: ApiDefinition,
    { session, body, silenceWarnings, processor }: RequestOptions,
) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);

    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            // biome-ignore lint/style/useNamingConvention: unknown value
            ...(session ? { Authorization: `Bearer ${session}` } : {}),
        },
        signal: controller.signal,
    };

    const url = `${BASE_URL}/${endpoint}`;

    if (LOG_CALLS) {
        console.debug(method, BASE_URL, `/${endpoint}`);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        try {
            const { message } = (await response.json()) as FramerateResponse;

            if ((silenceWarnings as number[])?.includes(response.status)) {
                return null;
            }

            console.warn(message);
        } catch {
            console.warn("Network response was not ok");
        }
        return null;
    }

    try {
        const { data, message } = (await response.json()) as FramerateResponse;
        if (message) console.warn(message);

        if (processor) return processor(data);

        return data;
    } catch {
        console.warn("Response object was not ok");
    }
    return null;
};
