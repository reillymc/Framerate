import { StyleSheet, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import {
    IconAction,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    DropdownButton,
    MenuDecorator,
    MenuOption,
    MenuOptionContentToggle,
    WebDropdownMenu,
} from "@/components/webDropdown";
import { MediaType } from "@/constants/mediaTypes";
import type { Company } from "@/modules/company";

import { getRatingLabel } from "../helpers";
import type { ReviewOrder, ReviewSort } from "../models";

export interface FilterableReviewListHeaderProps {
    mediaType: MediaType;
    company: Company | undefined;
    companyOptions: Company[];
    order: ReviewOrder;
    rating: number | undefined;
    sort: ReviewSort;
    starCount: number;
    starValueList: number[];
    venue: string | undefined;
    venueOptions: string[];
    onChangeCompany: (companyId: string | undefined) => void;
    onChangeOrder: (order: ReviewOrder) => void;
    onChangeRating: (rating: number | undefined) => void;
    onChangeSort: (sort: ReviewSort) => void;
    onChangeVenue: (venue: string | undefined) => void;
}

export const FilterableReviewListHeader = ({
    mediaType,
    company,
    companyOptions,
    order,
    rating,
    sort,
    starCount,
    starValueList,
    venue,
    venueOptions,
    onChangeCompany,
    onChangeOrder,
    onChangeRating,
    onChangeSort,
    onChangeVenue,
}: FilterableReviewListHeaderProps) => {
    const styles = useThemedStyles(createStyles, {});

    const SortOptions: { value: ReviewSort; label: string }[] = [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
    ];

    const OrderOptions: { value: ReviewOrder; label: string }[] = [
        { value: "date", label: "Review Date" },
        { value: "rating", label: "Review Rating" },
        {
            value: "mediaTitle",
            label: mediaType === MediaType.Movie ? "Movie Title" : "Show Title",
        },
        {
            value: "mediaReleaseDate",
            label:
                mediaType === MediaType.Movie
                    ? "Movie Release Date"
                    : "Show Air Date",
        },
    ];

    return (
        <View
            style={[
                styles.pageElement,
                styles.filterList,
                styles.webListHeader,
            ]}
        >
            <View style={styles.webFilterButtons}>
                <WebDropdownMenu
                    trigger={
                        <DropdownButton
                            label={
                                rating === undefined
                                    ? "All Ratings"
                                    : getRatingLabel(rating, starCount)
                            }
                        />
                    }
                >
                    {[
                        ...starValueList.map((value) => (
                            <MenuOption
                                key={value}
                                onSelect={() =>
                                    onChangeRating(
                                        rating === value ? undefined : value,
                                    )
                                }
                            >
                                <MenuOptionContentToggle
                                    title={getRatingLabel(value, starCount)}
                                    selected={rating === value}
                                />
                            </MenuOption>
                        )),
                        <MenuOption
                            key="-1"
                            onSelect={() =>
                                onChangeRating(rating === -1 ? undefined : -1)
                            }
                        >
                            <MenuOptionContentToggle
                                title="No Rating"
                                selected={rating === -1}
                            />
                        </MenuOption>,
                    ]}
                </WebDropdownMenu>
                <WebDropdownMenu
                    trigger={<DropdownButton label={venue ?? "All Venues"} />}
                >
                    {venueOptions
                        .sort((a, b) => a.localeCompare(b))
                        .map((value) => (
                            <MenuOption
                                key={value}
                                onSelect={() =>
                                    onChangeVenue(
                                        venue === value ? undefined : value,
                                    )
                                }
                            >
                                <MenuOptionContentToggle
                                    title={value}
                                    selected={venue === value}
                                />
                            </MenuOption>
                        ))}
                </WebDropdownMenu>
                <WebDropdownMenu
                    trigger={
                        <DropdownButton
                            label={
                                company
                                    ? `${company.firstName} ${company.lastName}`
                                    : "All Company"
                            }
                        />
                    }
                >
                    {companyOptions
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map(({ companyId, firstName, lastName }) => (
                            <MenuOption
                                key={companyId}
                                onSelect={() =>
                                    onChangeCompany(
                                        company?.companyId === companyId
                                            ? undefined
                                            : companyId,
                                    )
                                }
                            >
                                <MenuOptionContentToggle
                                    title={`${firstName} ${lastName}`}
                                    selected={company?.companyId === companyId}
                                />
                            </MenuOption>
                        ))}
                </WebDropdownMenu>
            </View>
            <WebDropdownMenu
                trigger={
                    <IconAction
                        iconSet={Octicons}
                        iconName="arrow-switch"
                        containerStyle={[
                            styles.sortIcon,
                            { borderRadius: 8, padding: 20 },
                        ]}
                    />
                }
            >
                {[
                    ...OrderOptions.map(({ value, label }) => (
                        <MenuOption
                            key={value}
                            onSelect={() => onChangeOrder(value)}
                        >
                            <MenuOptionContentToggle
                                title={label}
                                selected={order === value}
                            />
                        </MenuOption>
                    )),
                    <MenuDecorator key="separator">
                        <View style={styles.separator} />
                    </MenuDecorator>,
                    ...SortOptions.map(({ value, label }) => (
                        <MenuOption
                            key={value}
                            onSelect={() => onChangeSort(value)}
                        >
                            <MenuOptionContentToggle
                                title={label}
                                selected={sort === value}
                            />
                        </MenuOption>
                    )),
                ]}
            </WebDropdownMenu>
        </View>
    );
};

const createStyles = ({ theme: { spacing, color, border } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        filterList: {
            paddingBottom: spacing.medium,
            gap: spacing.small,
        },
        webListHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        webFilterButtons: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        sortIcon: {
            transform: [{ rotateZ: "90deg" }],
        },
        separator: {
            height: 2,
            width: "100%",
            borderRadius: border.radius.tight,
            backgroundColor: color.border,
        },
    });
