import type { FC } from "react";
import { StyleSheet } from "react-native";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { BlurIconAction, ContextMenu } from "@/components";
import { MediaType } from "@/constants/mediaTypes";

import type { ReviewOrder, ReviewSort } from "../models";

interface ReviewSortButtonProps {
    order: ReviewOrder;
    sort: ReviewSort;
    mediaType: MediaType;
    onChangeOrder: (order: ReviewOrder) => void;
    onChangeSort: (sort: ReviewSort) => void;
}

export const ReviewSortButton: FC<ReviewSortButtonProps> = ({
    order,
    sort,
    mediaType,
    onChangeOrder,
    onChangeSort,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <ContextMenu
            menuConfig={{
                menuTitle: "Sort by",
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
                        actionTitle:
                            mediaType === MediaType.Movie
                                ? "Movie Title"
                                : "Show Title",
                        menuState: order === "mediaTitle" ? "on" : "off",
                    },
                    {
                        actionKey: "mediaReleaseDate",
                        actionTitle:
                            mediaType === MediaType.Movie
                                ? "Movie Release Date"
                                : "Show Air Date",
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
            onPressMenuAction={({ actionKey }) => {
                if (
                    [
                        "rating",
                        "mediaTitle",
                        "date",
                        "mediaReleaseDate",
                    ].includes(actionKey)
                ) {
                    onChangeOrder(actionKey as ReviewOrder);
                    return;
                }

                if (["asc", "desc"].includes(actionKey)) {
                    onChangeSort(actionKey as ReviewSort);
                    return;
                }
            }}
        >
            <BlurIconAction
                iconName="arrow-switch"
                variant="secondary"
                style={styles.sortIcon}
            />
        </ContextMenu>
    );
};

ReviewSortButton.displayName = "SortButton";

const createStyles = (_: ThemedStyles) =>
    StyleSheet.create({
        sortIcon: {
            transform: [{ rotateZ: "90deg" }],
        },
    });
