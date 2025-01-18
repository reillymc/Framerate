import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";

export const useHealth = () => {
    const { session, host, defaultHost } = useSession();

    return useQuery({
        queryKey: ["health"],
        queryFn: async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                    // biome-ignore lint/style/useNamingConvention: unknown value
                    ...(session ? { Authorization: `Bearer ${session}` } : {}),
                },
            };

            const url = `${host || defaultHost}/health`;

            const response = await fetch(url, options);

            if (!response.ok) {
                return null;
            }

            const version = response.headers.get("version");

            return version ?? null;
        },
    });
};
