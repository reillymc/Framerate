import type { FC } from "react";

import type { Review } from "../models";

interface RatingHistoryChartProps {
    reviews: Array<Pick<Review, "date" | "rating">>;
    chartHeight?: number;
}

export const RatingHistoryChart: FC<RatingHistoryChartProps> = () => null;
