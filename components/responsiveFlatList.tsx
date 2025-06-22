import { useTheme } from "@reillymc/react-native-components";
import { useMemo } from "react";
import { type FlatListProps, useWindowDimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface ResponsiveFlatListProps<ItemT>
    extends Omit<FlatListProps<ItemT>, "numColumns"> {
    minColumnWidth: number;
}

export const ResponsiveFlatList = <ItemT,>({
    minColumnWidth,
    ...props
}: ResponsiveFlatListProps<ItemT>) => {
    const { width: screenWidth } = useWindowDimensions();
    const { theme } = useTheme();
    const gap = theme.spacing.pageHorizontal / 2;

    const columnCount = useMemo(() => {
        return Math.floor(
            (screenWidth - theme.spacing.pageHorizontal * 2) /
                (minColumnWidth + gap),
        );
    }, [screenWidth, theme.spacing.pageHorizontal, minColumnWidth, gap]);

    return (
        <FlatList
            key={columnCount}
            numColumns={columnCount}
            columnWrapperStyle={columnCount > 1 ? { gap } : undefined}
            {...props}
        />
    );
};
