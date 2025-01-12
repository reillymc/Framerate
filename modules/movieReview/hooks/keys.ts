const baseKey = "movieReviews";
export const MovieReviewKeys = {
    base: [baseKey],
    list: (params: unknown) => [baseKey, "infiniteList", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
