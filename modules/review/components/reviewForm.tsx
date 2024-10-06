import type { UserSummary } from "@/modules/user/services";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    DropdownInput,
    SelectionInput,
    Text,
    TextInput,
    type ThemedStyles,
    ToggleInput,
    type ValueItem,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { type FC, useRef } from "react";
import { StyleSheet, View, type TextInput as rnTextInput } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { ratingToStars, starsToRating } from "../helpers";

interface ReviewFormProps {
    rating: number;
    includeDate: boolean;
    date: Date;
    description: string;
    venue: string | undefined;
    starCount: number;
    company: ValueItem[];
    companyOptions: UserSummary[];
    venueOptions: string[];
    onRatingChange: (rating: number) => void;
    onIncludeDateChange: (includeDate: boolean) => void;
    onDateChange: (date: Date) => void;
    onDescriptionChange: (description: string) => void;
    onVenueChange: (venue: string) => void;
    onCompanyChange: (company: ValueItem[]) => void;
}

export const ReviewForm: FC<ReviewFormProps> = ({
    includeDate,
    rating,
    date,
    description,
    venue,
    company,
    companyOptions,
    venueOptions,
    starCount,
    onRatingChange,
    onIncludeDateChange,
    onDateChange,
    onDescriptionChange,
    onVenueChange,
    onCompanyChange,
}) => {
    const dropdownRef = useRef<rnTextInput>(null);

    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <StarRating
                style={styles.rating}
                rating={ratingToStars(rating, starCount)}
                enableHalfStar
                maxStars={starCount}
                starSize={260 / starCount}
                onChange={(value) =>
                    onRatingChange(starsToRating(value, starCount))
                }
                enableSwiping
                animationConfig={{
                    duration: 0,
                    scale: 1,
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <ToggleInput
                    value={includeDate}
                    size="small"
                    variant="secondary"
                    onChange={onIncludeDateChange}
                />
                {includeDate ? (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        style={styles.dateInput}
                        disabled={!includeDate}
                        maximumDate={new Date()}
                        onChange={(_, newDate) =>
                            newDate && onDateChange(newDate)
                        }
                        accentColor={theme.color.primary}
                        hitSlop={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    />
                ) : (
                    <View style={styles.datePlaceholderContainer}>
                        <Text variant="caption">No Date</Text>
                    </View>
                )}
            </View>
            <TextInput
                label="Review"
                value={description}
                onChangeText={onDescriptionChange}
                multiline
                numberOfLines={3}
                containerStyle={[styles.input, styles.reviewInputContainer]}
                style={styles.reviewInput}
            />
            <DropdownInput
                ref={dropdownRef}
                label="Venue"
                minimumSearchLength={0}
                value={venue}
                onChangeText={onVenueChange}
                maxSuggestionCount={3}
                onSelect={(e) => {
                    onVenueChange(e?.value ?? "");
                    if (e?.value) {
                        dropdownRef.current?.blur();
                    }
                }}
                style={styles.input}
                clearButtonMode="while-editing"
                items={venueOptions.map((venue) => ({
                    value: venue,
                    label: venue,
                }))}
            />
            <SelectionInput
                label="Company"
                selectionMode="multi"
                selection={company}
                items={companyOptions.map((user) => ({
                    value: user.userId,
                    label: `${user.firstName} ${user.lastName}`,
                }))}
                onChange={onCompanyChange}
                style={styles.input}
            />
        </>
    );
};

ReviewForm.displayName = "ReviewForm";

const createStyles = ({ theme: { padding } }: ThemedStyles) => {
    const dateInputHeight = 40;
    const dateInputWidth = 120;
    return StyleSheet.create({
        input: {
            marginBottom: padding.regular,
        },
        reviewInputContainer: {
            marginTop: -padding.large,
        },
        reviewInput: {
            minHeight: 80,
        },
        rating: {
            flex: 1,
            alignSelf: "center",
            marginBottom: padding.large,
        },
        dateInput: {
            height: dateInputHeight,
            width: dateInputWidth,
        },
        datePlaceholderContainer: {
            height: dateInputHeight,
            width: dateInputWidth,
            paddingLeft: padding.regular,
            justifyContent: "center",
            alignItems: "center",
        },
    });
};
