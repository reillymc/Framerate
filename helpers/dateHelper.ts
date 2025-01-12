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

export const displayFullNumeric = (date: Date | undefined) => {
    if (!date) return undefined;
    return date.toLocaleString("default", {
        day: "2-digit",
        weekday: undefined,
        month: "2-digit",
        year: "numeric",
    });
};
