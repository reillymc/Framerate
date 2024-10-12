import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowReview } from "../models";

export type GetShowReviewRequest = {
    reviewId: string;
};

type GetReview = FramerateService<ShowReview, GetShowReviewRequest>;

export const getShowReview: GetReview = ({ reviewId, session }) =>
    ExecuteRequest(FRAMERATE_API.showReviews.getReview(reviewId), {
        session,
    });
