import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { MetaKeys } from "./keys";

export const useClientConfig = () => {
    const { meta } = useFramerateServices();

    return useQuery({
        queryKey: MetaKeys.clientConfig,
        enabled: !!meta,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => meta!.getClientConfig({ signal }),
        staleTime: 1000 * 60 * 60 * 7,
    });
};
