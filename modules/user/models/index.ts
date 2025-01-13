import type { DeepPartial } from "@reillymc/react-native-components";
export { User } from "../../../services";

export type Configuration = {
    company: {
        knownUserIds: string[];
    };
    venues: {
        knownVenueNames: string[];
    };
    ratings: {
        starCount: 5 | 10;
    };
};

export const DefaultConfiguration: Configuration = {
    company: {
        knownUserIds: [],
    },
    venues: {
        knownVenueNames: [],
    },
    ratings: {
        starCount: 10,
    },
};

export const ParseConfiguration = (
    configuration: Partial<Configuration>,
): Configuration => MergeConfiguration(DefaultConfiguration, configuration);

export const MergeConfiguration = (
    first: Configuration,
    second: DeepPartial<Configuration>,
): Configuration => {
    return {
        company: {
            ...first.company,
            knownUserIds: (second.company?.knownUserIds ??
                first.company.knownUserIds) as string[],
        },
        venues: {
            ...first.venues,
            knownVenueNames: (second.venues?.knownVenueNames ??
                first.venues.knownVenueNames) as string[],
        },
        ratings: {
            ...first.ratings,
            starCount: second.ratings?.starCount ?? first.ratings.starCount,
        },
    };
};
