export const displayYear = (date: string | undefined) => {
    if (!date) return "Unknown";
    return new Date(date).getFullYear().toString();
};

export const displayFull = (date: string | undefined) => {
    if (!date) return undefined;
    return new Date(date).toLocaleString("default", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const displayWithWeek = (date: string | undefined) => {
    if (!date) return undefined;
    return new Date(date).toLocaleString("default", {
        year: undefined,
        month: "long",
        weekday: "long",
        day: "numeric",
    });
};

export const displayFullNumeric = (date: string | undefined) => {
    if (!date) return undefined;
    return new Date(date).toLocaleString("default", {
        day: "2-digit",
        weekday: undefined,
        month: "2-digit",
        year: "numeric",
    });
};

export const formatForSave = (date: Date | undefined) => {
    if (!date) return undefined;

    return date.toISOString().split("T")[0];
};
