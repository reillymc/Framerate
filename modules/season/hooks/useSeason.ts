import { useQuery } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import { SeasonKeys } from "./keys";

export const useSeason = (
    showId: number | undefined,
    seasonNumber: number | undefined,
) => {
    const { seasons } = useFramerateServices();

    return useQuery({
        queryKey: SeasonKeys.details(showId, seasonNumber),
        enabled: !!seasons && !!showId && seasonNumber !== undefined,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
            seasons!.details(
                // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
                { showId: showId!, seasonNumber: seasonNumber! },
                { signal },
            ),
    });
};
