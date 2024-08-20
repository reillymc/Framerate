import type { ApiDefinition } from "@/constants/api";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const LOG_CALLS = process.env.EXPO_PUBLIC_LOG_CALLS;

export const ExecuteRequest = async (
    { method, endpoint }: ApiDefinition,
    body?: Record<string, unknown>,
    // biome-ignore lint/suspicious/noExplicitAny: generic processor function
    processor?: (data: any) => any,
) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);

    const options = {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        signal: controller.signal,
    };

    const url = `${BASE_URL}/${endpoint}`;

    if (LOG_CALLS) {
        console.debug(method, BASE_URL, `/${endpoint}`);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const json = await response.json();

    if (processor) return processor(json);

    return json;
};
