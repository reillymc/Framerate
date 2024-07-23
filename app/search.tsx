import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";

import {
    Action,
    Icon,
    ListItem,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useSearch } from "@/hooks";
import { useReview, useSaveReview } from "@/modules/review";

const Edit: React.FC = () => {
    const { review: reviewId } = useGlobalSearchParams<{ review: string }>();

    const { data: review } = useReview(reviewId);

    const router = useRouter();
    const { mutate: saveReview } = useSaveReview();

    const styles = useThemedStyles(createStyles, {});

    const [searchValue, setSearchValue] = React.useState("");
    const { data: results } = useSearch({ searchValue });

    const handleClose = () => {
        router.back();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${reviewId ? "Edit" : "Add"} Review`,
                    headerLeft: () => (
                        <Action
                            label="Cancel"
                            style={styles.headerAction}
                            onPress={handleClose}
                        />
                    ),

                    headerSearchBarOptions: {
                        onChangeText: ({ nativeEvent }) =>
                            setSearchValue(nativeEvent.text),
                        placeholder: "Search for a movie or show",
                        hideWhenScrolling: false,
                        hideNavigationBar: false,
                    },
                }}
            />
            <StatusBar barStyle="light-content" animated={true} />
            {searchValue ? (
                <FlatList
                    data={results}
                    keyboardDismissMode="on-drag"
                    renderItem={({ item }) => (
                        <ListItem
                            header={
                                <Text>{`${item.title} (${item.year})`}</Text>
                            }
                            onPress={() =>
                                router.push({
                                    pathname: "editReview",
                                    params: { mediaId: item.mediaId },
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.mediaId.toString()}
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}
                />
            ) : (
                <ScrollView
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 6,
                            alignItems: "baseline",
                        }}
                    >
                        <Text variant="title">Recent Movies</Text>
                        <Icon
                            iconName="chevron-right"
                            set="octicons"
                            size={24}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 6,
                            alignItems: "baseline",
                        }}
                    >
                        <Text variant="title">Recent Shows</Text>
                        <Icon
                            iconName="chevron-right"
                            set="octicons"
                            size={24}
                        />
                    </View>
                </ScrollView>
            )}
        </>
    );
};

export default Edit;

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: padding.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.large,
        },
        bookDisplay: {
            flexDirection: "row",
            gap: padding.large,
            marginBottom: padding.tiny,
            alignItems: "center",
        },
        bookContainer: {
            transform: [{ scale: 0.8 }, { translateX: -20 }],
        },
        detailsInputContainer: {
            position: "absolute",
            right: 0,
            width: "56%",
        },
        formElement: {
            marginBottom: padding.regular,
        },
        deleteLeaveButton: {
            backgroundColor: color.background,
            paddingBottom: padding.large,
            paddingTop: padding.small,
        },
    });
