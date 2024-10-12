import type { FC } from "react";
import type { Review } from "../models";

interface ReviewRatingTimelineProps {
    reviews: Array<Pick<Review, "date" | "rating">>;
    chartHeight?: number;
}

export const ReviewRatingTimeline: FC<ReviewRatingTimelineProps> = () => null;
