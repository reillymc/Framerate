import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ShowKeys } from "./keys";

export const usePopularShows = () => {
    const { shows } = useFramerateServices();

    return useQuery({
        queryKey: ShowKeys.popular(),
        enabled: !!shows,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => shows!.popular({ signal }),
    });
};
