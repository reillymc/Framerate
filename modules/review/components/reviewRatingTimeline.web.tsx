import type { FC } from "react";
import type { ReviewSummary } from "../services";

interface ReviewRatingTimelineProps {
    reviews: Array<Pick<ReviewSummary, "date" | "rating">>;
    chartHeight?: number;
}

export const ReviewRatingTimeline: FC<ReviewRatingTimelineProps> = () => null;
