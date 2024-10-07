import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { SeasonsService } from "../services";
import { SeasonKeys } from "./keys";

export const useSeason = (
    showId: number | undefined,
    seasonNumber: number | undefined,
) => {
    const { session } = useSession();

    return useQuery({
        queryKey: SeasonKeys.details(showId, seasonNumber),
        enabled: !!showId && seasonNumber !== undefined,
        queryFn: () =>
            SeasonsService.getSeason({
                // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
                showId: showId!,
                // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
                seasonNumber: seasonNumber!,
                session,
            }),
    });
};
