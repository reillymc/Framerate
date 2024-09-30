import { MenuIconButton } from "@/components";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import type { ReviewOrder, ReviewSort } from "../constants";

interface ReviewSortButtonProps {
    order: ReviewOrder;
    sort: ReviewSort;
    onChangeOrder: (order: ReviewOrder) => void;
    onChangeSort: (sort: ReviewSort) => void;
}

export const ReviewSortButton: FC<ReviewSortButtonProps> = ({
    order,
    sort,
    onChangeOrder,
    onChangeSort,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <MenuIconButton
            iconName="arrow-switch"
            variant="secondary"
            menuConfig={{
                menuTitle: "Sort reviews by",
                menuItems: [
                    {
                        actionKey: "date",
                        actionTitle: "Review Date",
                        menuState: order === "date" ? "on" : "off",
                    },
                    {
                        actionKey: "rating",
                        actionTitle: "Review Rating",
                        menuState: order === "rating" ? "on" : "off",
                    },
                    {
                        actionKey: "mediaTitle",
                        actionTitle: "Movie Title",
                        menuState: order === "mediaTitle" ? "on" : "off",
                    },
                    {
                        actionKey: "mediaReleaseDate",
                        actionTitle: "Movie Release Date",
                        menuState: order === "mediaReleaseDate" ? "on" : "off",
                    },
                    {
                        type: "menu",
                        menuTitle: "",
                        menuOptions: ["displayInline"],
                        menuItems: [
                            {
                                type: "action",
                                actionKey: "asc",
                                actionTitle: "Ascending",
                                menuState: sort === "asc" ? "on" : "off",
                            },
                            {
                                type: "action",
                                actionKey: "desc",
                                actionTitle: "Descending",
                                menuState: sort === "desc" ? "on" : "off",
                            },
                        ],
                    },
                ],
            }}
            onPressMenuItem={({ nativeEvent }) => {
                if (
                    [
                        "rating",
                        "mediaTitle",
                        "date",
                        "mediaReleaseDate",
                    ].includes(nativeEvent.actionKey)
                ) {
                    onChangeOrder(nativeEvent.actionKey as ReviewOrder);
                    return;
                }

                if (["asc", "desc"].includes(nativeEvent.actionKey)) {
                    onChangeSort(nativeEvent.actionKey as ReviewSort);
                    return;
                }
            }}
            style={styles.sortIcon}
        />
    );
};

ReviewSortButton.displayName = "SortButton";

const createStyles = (_: ThemedStyles) =>
    StyleSheet.create({
        sortIcon: {
            transform: [{ rotateZ: "90deg" }],
        },
    });
