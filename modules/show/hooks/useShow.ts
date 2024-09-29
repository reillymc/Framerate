import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ShowsService } from "../services";
import { ShowKeys } from "./keys";

export const useShow = (id: number | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: ShowKeys.details(id),
        enabled: !!id,
        queryFn: () =>
            ShowsService.getShow({
                // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
                id: id!,
                session,
            }),
    });
};
