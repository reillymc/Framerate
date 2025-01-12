import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ShowKeys } from "./keys";

export const useShow = (id: number | undefined) => {
    const { shows } = useFramerateServices();

    return useQuery({
        queryKey: ShowKeys.details(id),
        enabled: !!shows && !!id,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => shows!.details({ showId: id! }),
    });
};
