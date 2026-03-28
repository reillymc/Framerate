import { addYears, lastDayOfMonth, startOfMonth, subMonths } from "date-fns";

import { MovieEntryConstants } from "../constants";
import type { MovieWatchlistEntry } from "../models";

type GroupedWatchlistEntries = {
    monthTitle?: string;
    yearTitle?: string;
    data: MovieWatchlistEntry[];
    date: Date;
};

export const getGroupedEntries = (entries: MovieWatchlistEntry[]) => {
    const now = new Date();

    const sections = Object.values(
        entries.reduce<Record<string, GroupedWatchlistEntries>>(
            (acc, entry) => {
                const date = new Date(entry.releaseDate ?? 0);
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();
                const key = `${month} ${year}`;

                const olderCutOff = startOfMonth(
                    subMonths(now, MovieEntryConstants.monthsBack),
                );

                if (!entry.releaseDate) {
                    if (acc.Future) {
                        acc.Future.data.push(entry);
                    } else {
                        acc.Future = {
                            yearTitle: "Upcoming",
                            data: [entry],
                            date: addYears(new Date(), 10),
                        };
                    }
                } else if (date < olderCutOff) {
                    if (acc.Older) {
                        acc.Older.data.push(entry);
                    } else {
                        acc.Older = {
                            yearTitle: "Older",
                            data: [entry],
                            date: olderCutOff,
                        };
                    }
                } else if (acc[key]) {
                    acc[key].data.push(entry);
                } else {
                    const sectionDate = new Date(
                        year,
                        date.getMonth(),
                        lastDayOfMonth(date).getDate(),
                    );
                    acc[key] = {
                        monthTitle: sectionDate.toLocaleString("default", {
                            month: "long",
                        }),
                        yearTitle: year.toString(),
                        date: sectionDate,
                        data: [entry],
                    };
                }

                return acc;
            },
            {},
        ),
    );

    const uniqueSections: GroupedWatchlistEntries[] = [];
    const processedYears = new Set<string>();

    for (const section of sections) {
        if (section.yearTitle) {
            if (processedYears.has(section.yearTitle)) {
                const { yearTitle: _, ...rest } = section;
                uniqueSections.push(rest);
            } else {
                processedYears.add(section.yearTitle);
                uniqueSections.push(section);
            }
        } else if (section.yearTitle === "Older") {
            uniqueSections.unshift(section);
        } else if (section.yearTitle === "Future") {
            uniqueSections.push(section);
        }
    }

    return uniqueSections;
};
