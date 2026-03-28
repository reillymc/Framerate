export enum ShowStatus {
    ReturningSeries = "Returning Series",
    Planned = "Planned",
    InProduction = "In Production",
    Ended = "Ended",
    Cancelled = "Cancelled",
    Pilot = "Pilot",
}

export const ActiveStatuses: ShowStatus[] = [
    ShowStatus.ReturningSeries,
    ShowStatus.Planned,
    ShowStatus.InProduction,
    ShowStatus.Pilot,
] as const;
