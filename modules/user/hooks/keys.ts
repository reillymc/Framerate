const baseKey = "users";
export const UserKeys = {
    mutate: [baseKey],
    list: () => [baseKey],
    details: (userId: string | undefined) => [baseKey, userId],
};
