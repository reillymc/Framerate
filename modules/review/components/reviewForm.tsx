import { type FC, useRef } from "react";
import {
    Platform,
    type TextInput as rnTextInput,
    StyleSheet,
    View,
} from "react-native";
import DateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import {
    Action,
    CollapsibleContainer,
    DropdownInput,
    RatingInput,
    SelectionInput,
    TextInput,
    type ThemedStyles,
    ToggleInput,
    useTheme,
    useThemedStyles,
    type ValueItem,
} from "@reillymc/react-native-components";

import { Accordion } from "@/components";

import { AbsoluteRatingScale } from "../models";

interface ReviewFormProps {
    includeDate: boolean;
    includeReview: boolean;
    rating: number | undefined;
    date: Date;
    description: string | undefined;
    venue: string | undefined;
    starCount: number;
    company: ValueItem[];
    companyOptions: ValueItem[];
    venueOptions: string[];
    onIncludeReviewChange: (includeReview: boolean) => void;
    onIncludeDateChange: (includeDate: boolean) => void;
    onRatingChange: (rating: number) => void;
    onDateChange: (date: Date) => void;
    onDescriptionChange: (description: string) => void;
    onVenueChange: (venue: string) => void;
    onCompanyPress: () => void;
}

export const ReviewForm: FC<ReviewFormProps> = ({
    includeReview,
    includeDate,
    rating = 0,
    date,
    description,
    venue,
    company,
    companyOptions,
    venueOptions,
    starCount,
    onIncludeReviewChange,
    onIncludeDateChange,
    onRatingChange,
    onDateChange,
    onDescriptionChange,
    onVenueChange,
    onCompanyPress,
}) => {
    const dropdownRef = useRef<rnTextInput>(null);

    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <View style={styles.dateRow}>
                <ToggleInput
                    label="Date"
                    value={includeDate}
                    iconVariant="check"
                    onChange={onIncludeDateChange}
                />
                <CollapsibleContainer
                    collapsed={!includeDate}
                    direction="right"
                >
                    {Platform.OS !== "android" ? (
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
                        />
                    ) : (
                        <Action
                            label={date.toDateString() ?? "No Date"}
                            containerStyle={styles.androidDatePicker}
                            onPress={() =>
                                DateTimePickerAndroid.open({
                                    mode: "date",
                                    maximumDate: new Date(),
                                    value: date,
                                    onChange: (_, newDate) =>
                                        newDate && onDateChange(newDate),
                                })
                            }
                        />
                    )}
                </CollapsibleContainer>
            </View>
            <ToggleInput
                label="Review"
                value={includeReview}
                iconVariant="check"
                onChange={onIncludeReviewChange}
            />
            <Accordion
                collapsed={!includeReview}
                style={styles.reviewInputContainer}
            >
                <RatingInput
                    containerStyle={styles.rating}
                    value={rating}
                    scale={AbsoluteRatingScale}
                    max={starCount}
                    onChange={onRatingChange}
                />
                <TextInput
                    value={description}
                    onChangeText={onDescriptionChange}
                    multiline
                    containerStyle={styles.input}
                    inputStyle={styles.reviewInput}
                    maxLength={1200}
                />
            </Accordion>
            <DropdownInput
                ref={dropdownRef}
                label="Venue"
                minimumSearchLength={0}
                onChangeText={onVenueChange}
                maxSuggestionCount={3}
                onSelect={(e) => {
                    onVenueChange(e?.value ?? "");
                    if (e?.value) {
                        dropdownRef.current?.blur();
                    }
                }}
                selectedValue={venue}
                containerStyle={styles.input}
                clearButtonMode="while-editing"
                items={venueOptions.map((venue) => ({
                    value: venue,
                    label: venue,
                }))}
                maxLength={80}
            />
            <SelectionInput
                label="Company"
                selectionMode="multi"
                selection={company}
                items={companyOptions}
                containerStyle={styles.input}
                onAdd={onCompanyPress}
            />
        </>
    );
};

ReviewForm.displayName = "ReviewForm";

const createStyles = ({
    theme: { spacing, color, border },
    styles: { toggleInput },
}: ThemedStyles) => {
    return StyleSheet.create({
        dateRow: {
            marginBottom: spacing.medium,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 38,
        },
        dateInput: {
            flex: 1,
        },
        androidDatePicker: {
            backgroundColor: color.foreground,
            paddingVertical: spacing.tiny,
            paddingHorizontal: spacing.small,
            borderRadius: border.radius.regular,
        },
        input: {
            marginBottom: spacing.medium,
        },
        reviewInputContainer: {
            marginLeft:
                toggleInput.label.gap + toggleInput.indicator.size.regular,
            marginBottom: spacing.medium,
        },
        reviewInput: {
            minHeight: 80,
        },
        rating: {
            flex: 1,
            alignSelf: "center",
            marginVertical: spacing.medium,
        },
    });
};
