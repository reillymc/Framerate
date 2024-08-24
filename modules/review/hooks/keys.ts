const baseKey = "reviews";
export const ReviewKeys = {
    base: [baseKey],
    list: (mediaId?: number) => [baseKey, "list", mediaId],
    infiniteList: (params: unknown) => [baseKey, "infiniteList", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
