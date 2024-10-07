import type { MediaType } from "@/constants/mediaTypes";
import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ReviewsService } from "../services";
import { ReviewKeys } from "./keys";

export const useMediaReviews = (
    mediaType: MediaType,
    mediaId: number | undefined,
) => {
    const { session } = useSession();

    return useQuery({
        queryKey: ReviewKeys.list(mediaId),
        enabled: !!mediaId,
        queryFn: () =>
            ReviewsService.getReviews({ mediaType, mediaId, session }),
    });
};
