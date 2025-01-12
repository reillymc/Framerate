import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { SeasonKeys } from "./keys";

export const useSeason = (
    showId: number | undefined,
    seasonNumber: number | undefined,
) => {
    const { seasons } = useFramerateServices();

    return useQuery({
        queryKey: SeasonKeys.details(showId, seasonNumber),
        enabled: !!seasons && !!showId && seasonNumber !== undefined,
        queryFn: () =>
            // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
            seasons!.details({ showId: showId!, seasonNumber: seasonNumber! }),
    });
};
