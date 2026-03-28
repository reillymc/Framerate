const baseKey = "users";
export const UserKeys = {
    mutate: [baseKey],
    list: () => [baseKey, "list"],
    details: (userId: string | undefined) => [baseKey, "details", userId],
};
