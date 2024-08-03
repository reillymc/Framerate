import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";

import {
    Action,
    TextInput,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import StarRating from "react-native-star-rating-widget";

import { useMovieDetails } from "@/hooks";
import {
    ratingToStars,
    starsToRating,
    useReview,
    useSaveReview,
} from "@/modules/review";

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

    const [date, setDate] = React.useState(
        review?.date ?? new Date().toISOString().split("T")[0],
    );
    const [rating, setRating] = React.useState(
        ratingToStars(review?.rating ?? 0),
    );
    const [reviewDescription, setReviewDescription] = React.useState(
        review?.reviewDescription ?? "",
    );

    useEffect(() => {
        setDate(review?.date ?? new Date().toISOString().split("T")[0]);
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
            date,
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
                    title: `${reviewId ? "Edit" : "Add"} Review`,
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

                <TextInput
                    label="Watch date"
                    value={date}
                    style={styles.input}
                    onChangeText={setDate}
                />
                <TextInput
                    label="Review"
                    value={reviewDescription}
                    onChangeText={setReviewDescription}
                    multiline
                    numberOfLines={3}
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
        reviewInput: {
            minHeight: 80,
        },
        rating: {
            flex: 1,
            height: 64,
            alignSelf: "center",
            marginBottom: padding.regular,
        },
    });
