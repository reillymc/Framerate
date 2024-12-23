import { BASE_URL, FRAMERATE_API } from "@/constants/api";
import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";

export const useHealth = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: ["health"],
        queryFn: async () => {
            const { method, endpoint } = FRAMERATE_API.health.get();

            const options = {
                method,
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                    // biome-ignore lint/style/useNamingConvention: unknown value
                    ...(session ? { Authorization: `Bearer ${session}` } : {}),
                },
            };

            const url = `${BASE_URL}/${endpoint}`;

            const response = await fetch(url, options);

            if (!response.ok) {
                return null;
            }

            const version = response.headers.get("version");

            return version ?? null;
        },
    });
};
