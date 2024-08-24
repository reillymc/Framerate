const baseKey = "reviews";
export const ReviewKeys = {
    base: [baseKey],
    list: (params: unknown) => [baseKey, "list", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
