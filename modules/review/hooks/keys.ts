const baseKey = "reviews";
export const ReviewKeys = {
    mutate: [baseKey],
    list: (params: unknown) => [baseKey, "list", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
