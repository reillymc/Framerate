import type { FC } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import {
    SwipeAction,
    SwipeView,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import type { RecentSearch } from "@/hooks";

type RecentSearchListProps = {
    recentSearches: RecentSearch[];
    onDeleteSearchItem: (index: number) => void;
    onPressSearchItem: (searchItem: RecentSearch) => void;
};

export const RecentSearchList: FC<RecentSearchListProps> = ({
    recentSearches,
    onDeleteSearchItem,
    onPressSearchItem,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <FlatList
            data={recentSearches}
            contentContainerStyle={styles.searchList}
            keyboardDismissMode="on-drag"
            keyExtractor={(item) => item.searchValue}
            contentInsetAdjustmentBehavior="always"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
                <SwipeView
                    rightActions={[
                        <SwipeAction
                            key="delete"
                            variant="destructive"
                            iconName="close"
                            onPress={() => onDeleteSearchItem(index)}
                        />,
                    ]}
                >
                    <Pressable
                        onPress={() => onPressSearchItem(item)}
                        style={[
                            styles.searchSuggestion,
                            index === recentSearches.length - 1 && {
                                borderBottomWidth: 0,
                            },
                        ]}
                    >
                        <Text>{item.searchValue}</Text>
                    </Pressable>
                </SwipeView>
            )}
        />
    );
};

const createStyles = ({ theme: { spacing, color, border } }: ThemedStyles) =>
    StyleSheet.create({
        searchList: {
            paddingTop: spacing.small,
            paddingBottom: spacing.pageBottom,
        },
        searchSuggestion: {
            marginLeft: spacing.pageHorizontal,
            paddingVertical: spacing.medium,
            borderBottomWidth: border.width.thin,
            borderBottomColor: color.border,
            backgroundColor: color.background,
        },
    });
