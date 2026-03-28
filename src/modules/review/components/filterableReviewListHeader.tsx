import { ScrollView, StyleSheet } from "react-native";
import {
    Tag,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ContextMenu } from "@/components";
import type { MediaType } from "@/constants/mediaTypes";
import type { Company } from "@/modules/company";

import { getRatingLabel } from "../helpers";
import type { ReviewOrder, ReviewSort } from "../models";

const menuState = (condition: boolean) =>
    condition ? ("on" as const) : ("off" as const);

interface FilterableReviewListHeaderProps {
    mediaType: MediaType;
    starValueList: number[];
    rating: number | undefined;
    venue: string | undefined;
    company: Company | undefined;
    companyOptions: Company[];
    venueOptions: string[];
    onChangeRating: (rating: number | undefined) => void;
    onChangeVenue: (venue: string | undefined) => void;
    onChangeCompany: (companyId: string | undefined) => void;
    order: ReviewOrder;
    sort: ReviewSort;
    onChangeOrder: (order: ReviewOrder) => void;
    onChangeSort: (sort: ReviewSort) => void;
    starCount: number;
}

export const FilterableReviewListHeader = ({
    starValueList,
    rating,
    venue,
    company,
    companyOptions,
    venueOptions,
    onChangeRating,
    onChangeVenue,
    onChangeCompany,
    starCount,
}: FilterableReviewListHeaderProps) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.pageElement, styles.filterList]}
        >
            <ContextMenu
                menuConfig={{
                    menuTitle: "Rating",
                    menuItems: [
                        ...starValueList.map((value) => ({
                            actionKey: value.toString(),
                            actionTitle: getRatingLabel(value, starCount),
                            menuState: menuState(rating === value),
                        })),
                        {
                            actionKey: "-1",
                            actionTitle: "No Rating",
                            menuState: menuState(rating === -1),
                        },
                    ],
                }}
                onPressMenuAction={({ actionKey }) => {
                    const value = Number.parseInt(actionKey, 10);
                    onChangeRating(rating === value ? undefined : value);
                }}
            >
                <Tag
                    label={
                        rating === undefined
                            ? "All Ratings"
                            : getRatingLabel(rating, starCount)
                    }
                    variant="light"
                />
            </ContextMenu>

            {!!venueOptions.length && (
                <ContextMenu
                    menuConfig={{
                        menuTitle: "Venue",
                        menuItems: venueOptions
                            .sort((a, b) => a.localeCompare(b))
                            .map((name) => ({
                                actionKey: name,
                                actionTitle: name,
                                menuState: menuState(venue === name),
                            })),
                    }}
                    onPressMenuAction={({ actionKey }) => {
                        onChangeVenue(
                            venue === actionKey ? undefined : actionKey,
                        );
                    }}
                >
                    <Tag label={venue ?? "All Venues"} variant="light" />
                </ContextMenu>
            )}

            {!!companyOptions.length && (
                <ContextMenu
                    menuConfig={{
                        menuTitle: "Company",
                        menuItems: companyOptions
                            .sort((a, b) =>
                                a.firstName.localeCompare(b.firstName),
                            )
                            .map(({ companyId, firstName, lastName }) => ({
                                actionKey: companyId,
                                actionTitle: `${firstName} ${lastName}`,
                                menuState:
                                    company?.companyId === companyId
                                        ? "on"
                                        : "off",
                            })),
                    }}
                    onPressMenuAction={({ actionKey }) => {
                        onChangeCompany(
                            company?.companyId === actionKey
                                ? undefined
                                : actionKey,
                        );
                    }}
                >
                    <Tag
                        label={
                            company
                                ? `${company.firstName} ${company.lastName}`
                                : "All Company"
                        }
                        variant="light"
                    />
                </ContextMenu>
            )}
        </ScrollView>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        filterList: {
            paddingBottom: spacing.medium,
            gap: spacing.small,
        },
    });
