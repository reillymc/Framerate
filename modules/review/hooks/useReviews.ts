import { useQuery } from "@tanstack/react-query";
import { ReviewsService } from "../services";
import { ReviewKeys } from "./keys";

export const useReviews = (mediaId?: number) => {
    return useQuery({
        queryKey: ReviewKeys.list(mediaId),
        queryFn: () => ReviewsService.getReviews({ mediaId }),
    });
};
