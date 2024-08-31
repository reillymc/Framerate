import React, { type ForwardedRef, forwardRef } from "react";
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    FlatList as any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) as any;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface AnimatedFlatListBaseProps extends CellRendererProps<any> {
    inverted?: boolean;
    horizontal?: boolean;
}

const createCellRenderer = (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    itemLayoutAnimation?: any,
    cellStyle?: StyleProps,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

        const cellRenderer = React.useMemo(
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
