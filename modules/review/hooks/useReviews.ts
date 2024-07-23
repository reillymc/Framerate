import { useQuery } from "@tanstack/react-query";
import { ReviewsService } from "../services";

export const useReviews = (mediaId?: number) => {
    return useQuery({
        queryKey: mediaId ? ["reviews", mediaId] : ["reviews"],
        queryFn: () => ReviewsService.getReviews({ mediaId }),
    });
};
