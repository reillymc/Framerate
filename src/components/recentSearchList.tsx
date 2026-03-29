import type { FC } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Octicons } from "@expo/vector-icons";
import {
    ListItem,
    SwipeAction,
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
                <ListItem
                    variant="compact"
                    onPress={() => onPressSearchItem(item)}
                    heading={<Text>{item.searchValue}</Text>}
                    style={styles.searchSuggestion}
                    swipeActions={[
                        <SwipeAction
                            iconSet={Octicons}
                            key="delete"
                            variant="destructive"
                            iconName="x"
                            onPress={() => onDeleteSearchItem(index)}
                        />,
                    ]}
                />
            )}
        />
    );
};

const createStyles = ({ theme: { spacing, color } }: ThemedStyles) =>
    StyleSheet.create({
        searchList: {
            paddingTop: spacing.small,
            paddingBottom: spacing.pageBottom,
        },
        searchSuggestion: {
            backgroundColor: color.background,
        },
    });
