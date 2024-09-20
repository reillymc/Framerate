import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ReviewsService } from "../services";
import { ReviewKeys } from "./keys";

export const useReviews = (mediaId?: number) => {
    const { session } = useSession();

    return useQuery({
        queryKey: ReviewKeys.list(mediaId),
        queryFn: () => ReviewsService.getReviews({ mediaId, session }),
        select: (data) => data ?? undefined,
    });
};
