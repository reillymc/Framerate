export const displayYear = (date: Date | undefined) => {
    if (!date) return "Unknown";
    return date.getFullYear().toString();
};

export const displayFull = (date: Date | undefined) => {
    if (!date) return undefined;
    return date.toLocaleString("default", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
