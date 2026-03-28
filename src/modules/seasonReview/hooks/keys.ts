const baseKey = "seasonReviews";
export const SeasonReviewKeys = {
    base: [baseKey],
    list: (params: unknown) => [baseKey, "infiniteList", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
