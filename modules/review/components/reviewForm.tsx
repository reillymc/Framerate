import { Accordion, StarRating } from "@/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    CollapsibleContainer,
    DropdownInput,
    SelectionInput,
    TextInput,
    type ThemedStyles,
    ToggleInput,
    type ValueItem,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { type FC, useRef } from "react";
import {
    StyleSheet,
    View,
    type TextInput as rnTextInput,
    useWindowDimensions,
} from "react-native";
import { ratingToStars, starsToRating } from "../helpers";

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
    const { width } = useWindowDimensions();

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
                    {
                        <DateTimePicker
                            value={date}
                            mode="date"
                            style={styles.dateInput}
                            disabled={!includeDate}
                            maximumDate={new Date()}
                            onChange={(_, newDate) =>
                                newDate && onDateChange(newDate)
                            }
                            accentColor={theme.color.primaryLight}
                        />
                    }
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
                <StarRating
                    style={styles.rating}
                    rating={ratingToStars(rating, starCount)}
                    enableHalfStar
                    maxStars={starCount}
                    starSize={width / 2 / starCount}
                    onChange={(value) =>
                        onRatingChange(starsToRating(value, starCount))
                    }
                    enableSwiping
                    animationConfig={{
                        duration: 0,
                        scale: 1,
                    }}
                />

                <TextInput
                    value={description}
                    onChangeText={onDescriptionChange}
                    multiline
                    numberOfLines={3}
                    containerStyle={styles.input}
                    style={styles.reviewInput}
                    maxLength={1200}
                />
            </Accordion>
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
                onAdd={onCompanyPress}
                containerStyle={styles.input}
            />
        </>
    );
};

ReviewForm.displayName = "ReviewForm";

const createStyles = ({
    theme: { spacing },
    styles: { toggleInput },
}: ThemedStyles) => {
    return StyleSheet.create({
        dateRow: {
            marginBottom: spacing.medium,
            flexDirection: "row",
            justifyContent: "space-between",
            height: 38,
        },
        dateInput: {
            flex: 1,
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
