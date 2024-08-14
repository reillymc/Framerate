export type User = {
    id: string;
    firstName: string;
    lastName: string;
};

export type Configuration = {
    company: {
        knownUserIds: string[];
    };
    venues: {
        knownVenueNames: string[];
    };
};

export const DefaultConfiguration: Configuration = {
    company: {
        knownUserIds: [],
    },
    venues: {
        knownVenueNames: [],
    },
};

export const ParseConfiguration = (
    configuration: Partial<Configuration>,
): Configuration => {
    return {
        company: {
            knownUserIds: configuration.company?.knownUserIds ?? [],
        },
        venues: {
            knownVenueNames: configuration.venues?.knownVenueNames ?? [],
        },
    };
};
