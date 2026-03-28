import { useCallback, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { DeviceType, deviceType } from "expo-device";
import { useTheme } from "@reillymc/react-native-components";

export type PosterSize = "tiny" | "small" | "medium" | "large";

const PosterCountPhone: Record<PosterSize, number> = {
    large: 1,
    medium: 2,
    small: 3,
    tiny: 6,
};

const PosterCountTablet: Record<PosterSize, number> = {
    large: 3,
    medium: 4,
    small: 5,
    tiny: 8,
};

const PosterWidthWeb: Record<PosterSize, number> = {
    large: 270,
    medium: 180,
    small: 140,
    tiny: 60,
};
type PosterParams = {
    size: PosterSize;
    teaseSpacing?: boolean;
};

export type PosterProperties = {
    width: number;
    height: number;
    gap: number;
    interval: number;
    displayCount: number | undefined;
    configuration: PosterParams;
};

type UsePosterDimensionsParams = (params: PosterParams) => PosterProperties;

export const usePosterDimensions: UsePosterDimensionsParams = ({
    size,
    teaseSpacing,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const { theme } = useTheme();

    const gap = theme.spacing.pageHorizontal / 2;

    const calcWidth = useCallback(
        (posterCount: number) => {
            const pageSideSpacing = theme.spacing.pageHorizontal * 2;

            const posterInnerGaps =
                (theme.spacing.pageHorizontal * posterCount - 1) / 2;

            const posterFullScreenWidth =
                screenWidth - pageSideSpacing - posterInnerGaps + gap;

            const scaledPosterWidth =
                posterFullScreenWidth *
                (1 / (posterCount + (teaseSpacing ? 1 / 3 : 0)));

            return scaledPosterWidth;
        },
        [screenWidth, gap, teaseSpacing, theme.spacing.pageHorizontal],
    );

    const dimensions = useMemo(() => {
        if (Platform.OS !== "web") {
            const itemCount =
                deviceType === DeviceType.TABLET
                    ? PosterCountTablet[size]
                    : PosterCountPhone[size];

            const width = calcWidth(itemCount);

            return {
                width,
                height: width * (3 / 2),
                gap,
                interval: width + gap,
                displayCount: itemCount,
                configuration: { size, teaseSpacing },
            };
        }

        const width = PosterWidthWeb[size];

        return {
            width,
            height: width * (3 / 2),
            gap,
            interval: width + gap,
            displayCount: Math.floor(
                (screenWidth - theme.spacing.pageHorizontal * 2) /
                    (width + gap),
            ),
            configuration: { size, teaseSpacing },
        };
    }, [
        calcWidth,
        size,
        teaseSpacing,
        screenWidth,
        gap,
        theme.spacing.pageHorizontal,
    ]);

    return dimensions;
};
