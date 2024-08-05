import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";

import { useMovieDetails } from "@/hooks";
import {
    ratingToStars,
    starsToRating,
    useReview,
    useSaveReview,
} from "@/modules/review";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Action,
    Text,
    TextInput,
    type ThemedStyles,
    ToggleInput,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import StarRating from "react-native-star-rating-widget";

const Edit: React.FC = () => {
    const { reviewId, mediaId } = useGlobalSearchParams<{
        reviewId: string;
        mediaId: string;
    }>();

    const { data: review } = useReview(reviewId);
    const { data: movie } = useMovieDetails({
        mediaId: mediaId ? Number.parseInt(mediaId ?? "", 10) : review?.mediaId,
    });
    const router = useRouter();
    const { mutate: saveReview } = useSaveReview();

    const styles = useThemedStyles(createStyles, {});
    const theme = useTheme();

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );
    const [rating, setRating] = useState(ratingToStars(review?.rating ?? 0));
    const [reviewDescription, setReviewDescription] = useState(
        review?.reviewDescription ?? "",
    );

    const [includeDate, setUnknownDate] = useState(true);

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
        setRating(ratingToStars(review?.rating ?? 0));
        setReviewDescription(review?.reviewDescription ?? "");
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        if (!(movie && rating)) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? date.toISOString().split("T")[0] : undefined,
            mediaId: Number(movie.mediaId),
            mediaPosterUri: movie.poster ?? "",
            mediaReleaseYear: movie.year ?? 0,
            mediaTitle: movie.title,
            imdbId: movie.imdbId,
            mediaType: movie.type,
            rating: starsToRating(rating),
            reviewDescription,
        });
        handleClose();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${rating} Star${rating !== 1 ? "s" : ""}`,
                    headerLeft: () => (
                        <Action
                            label="Close"
                            style={styles.headerAction}
                            onPress={handleClose}
                        />
                    ),
                    headerRight: () => (
                        <Action
                            label={reviewId ? "Save" : "Create"}
                            style={styles.headerAction}
                            onPress={handleSave}
                        />
                    ),
                }}
            />
            <StatusBar barStyle="light-content" animated={true} />
            <ScrollView
                scrollEnabled={false}
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <StarRating
                    style={styles.rating}
                    rating={rating ?? 0}
                    enableHalfStar
                    maxStars={10}
                    starSize={26}
                    onChange={setRating}
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
                        onChange={setUnknownDate}
                    />
                    {includeDate ? (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            style={{ height: 40, width: 120 }}
                            disabled={!includeDate}
                            maximumDate={new Date()}
                            onChange={(_, newDate) =>
                                newDate && setDate(newDate)
                            }
                        />
                    ) : (
                        <View
                            style={{
                                height: 40,
                                width: 120,
                                paddingLeft: 12,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text variant="caption">No Date</Text>
                        </View>
                    )}
                </View>
                <TextInput
                    label="Review"
                    value={reviewDescription}
                    onChangeText={setReviewDescription}
                    multiline
                    numberOfLines={3}
                    containerStyle={styles.reviewInputContainer}
                    style={styles.reviewInput}
                />
            </ScrollView>
        </>
    );
};

export default Edit;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: padding.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.large,
        },
        input: {
            marginBottom: padding.regular,
        },
        reviewInputContainer: {
            marginTop: -20,
        },
        reviewInput: {
            minHeight: 80,
        },
        rating: {
            flex: 1,
            alignSelf: "center",
            marginBottom: padding.regular,
        },
    });
