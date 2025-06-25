// biome-ignore-all lint/suspicious/noExplicitAny: anys required for now in type definitions
import { type ForwardedRef, forwardRef, useMemo } from "react";
import {
    type CellRendererProps,
    FlatList,
    type FlatListProps,
    StyleSheet,
} from "react-native";
import Animated, {
    type ILayoutAnimationBuilder,
    type StyleProps,
} from "react-native-reanimated";

const AnimatedFlatListBase = Animated.createAnimatedComponent(
    FlatList as any,
) as any;

interface AnimatedFlatListBaseProps extends CellRendererProps<any> {
    inverted?: boolean;
    horizontal?: boolean;
}

const createCellRenderer = (
    itemLayoutAnimation?: any,
    cellStyle?: StyleProps,
    cellGen?: (props: CellRendererProps<any>) => StyleProps,
) => {
    const cellRenderer = (props: AnimatedFlatListBaseProps) => {
        return (
            <Animated.View
                layout={itemLayoutAnimation}
                onLayout={props.onLayout}
                style={[cellGen?.(props), cellStyle]}
            >
                {props.children}
            </Animated.View>
        );
    };

    return cellRenderer;
};

export interface AnimatedFlatListProps<ItemT> extends FlatListProps<ItemT> {
    itemLayoutAnimation?: ILayoutAnimationBuilder;
    cellStyle?: (props: CellRendererProps<ItemT>) => StyleProps;
}

/**
 * Custom implementation of Animated.FlatList which supports CellRendererComponent styling.
 */
export const AnimatedFlatList = forwardRef(
    (props: AnimatedFlatListProps<any>, ref: ForwardedRef<FlatList>) => {
        const {
            itemLayoutAnimation,
            cellStyle: cellStyleFromProps,
            ...restProps
        } = props;

        const cellStyle = restProps?.inverted
            ? restProps?.horizontal
                ? styles.horizontallyInverted
                : styles.verticallyInverted
            : undefined;

        const cellRenderer = useMemo(
            () =>
                createCellRenderer(
                    itemLayoutAnimation,
                    cellStyle,
                    cellStyleFromProps,
                ),
            [cellStyle, cellStyleFromProps, itemLayoutAnimation],
        );

        return (
            <AnimatedFlatListBase
                ref={ref}
                {...restProps}
                CellRendererComponent={cellRenderer}
            />
        );
    },
);

const styles = StyleSheet.create({
    verticallyInverted: { transform: [{ scaleY: -1 }] },
    horizontallyInverted: { transform: [{ scaleX: -1 }] },
});
