import { type FC, useRef } from "react";
import { type TextInput as rnTextInput, StyleSheet, View } from "react-native";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import Octicons from "@react-native-vector-icons/octicons/static";
import {
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
                    iconSet={Octicons}
                    iconName="check-circle-fill"
                    onChange={onIncludeDateChange}
                />
                <CollapsibleContainer
                    collapsed={!includeDate}
                    direction="right"
                    style={{ width: "30%" }} // Workaround for odd element positioning of new date time picker
                >
                    <DateTimePicker
                        value={date}
                        mode="date"
                        presentation="dialog"
                        disabled={!includeDate}
                        maximumDate={new Date()}
                        onValueChange={(_, newDate) =>
                            newDate && onDateChange(newDate)
                        }
                        accentColor={theme.color.primary}
                    />
                </CollapsibleContainer>
            </View>
            <ToggleInput
                label="Review"
                value={includeReview}
                iconSet={Octicons}
                iconName="check-circle-fill"
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
                textValue={venue}
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
            height: 34,
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
            marginVertical: spacing.medium,
        },
    });
};
