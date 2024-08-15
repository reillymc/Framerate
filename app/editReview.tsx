import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useRef, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    type TextInput as rnTextInput,
} from "react-native";

import { placeholderUserId } from "@/constants/placeholderUser";
import { useMovieDetails } from "@/hooks";
import {
    ratingToStars,
    starsToRating,
    useReview,
    useSaveReview,
} from "@/modules/review";

import { MediaType } from "@/constants/mediaTypes";
import { useUser, useUsers } from "@/modules/user";
import {
    useDeleteWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Action,
    DropdownInput,
    SelectionInput,
    Text,
    TextInput,
    type ThemedStyles,
    ToggleInput,
    Undefined,
    type ValueItem,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import StarRating from "react-native-star-rating-widget";

const Edit: FC = () => {
    const { reviewId, mediaId: mediaIdParam } = useGlobalSearchParams<{
        reviewId: string;
        mediaId: string;
    }>();

    const mediaId = mediaIdParam
        ? Number.parseInt(mediaIdParam ?? "", 10)
        : undefined;

    const { data: review } = useReview(reviewId);
    const { data: movie } = useMovieDetails({
        mediaId: mediaId ? mediaId : review?.mediaId,
    });
    const router = useRouter();
    const { mutate: saveReview } = useSaveReview();
    const { data: users = [] } = useUsers();
    const { data: user } = useUser(placeholderUserId);
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();

    const filteredUsers = users.filter(
        ({ userId }) => userId !== placeholderUserId,
    );

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );
    const [rating, setRating] = useState(ratingToStars(review?.rating ?? 0));
    const [reviewDescription, setReviewDescription] = useState(
        review?.reviewDescription ?? "",
    );

    const [includeDate, setIncludeDate] = useState(
        review ? !!review.date : true,
    );
    const [clearWatchlistEntry, setClearWatchlistEntry] = useState(true);
    const [venue, setVenue] = useState(review?.venue);
    const dropdownRef = useRef<rnTextInput>(null);
    const [company, setCompany] = useState<ValueItem[]>(
        review?.company
            ?.map((user) => ({
                value: user.userId,
                label: `${user.firstName} ${user.lastName}`,
            }))
            .filter(Undefined) ?? [],
    );

    const { data: watchlistEntry } = useWatchlistEntry(
        MediaType.Movie,
        mediaId,
    );

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
            mediaId: movie.mediaId,
            mediaPosterUri: movie.poster ?? "",
            mediaReleaseYear: movie.year ?? 0,
            mediaTitle: movie.title,
            imdbId: movie.imdbId,
            mediaType: movie.type,
            venue,
            rating: starsToRating(rating),
            reviewDescription,
            company: company.map(({ value }) => ({ userId: value })),
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteWatchlistEntry({
                mediaId: movie.mediaId,
                mediaType: MediaType.Movie,
            });
        }
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
                        onChange={setIncludeDate}
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
                            accentColor={theme.color.primary}
                            hitSlop={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
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
                    containerStyle={[styles.input, styles.reviewInputContainer]}
                    style={styles.reviewInput}
                />
                <DropdownInput
                    ref={dropdownRef}
                    label="Venue"
                    minimumSearchLength={0}
                    value={venue}
                    onChangeText={setVenue}
                    maxSuggestionCount={3}
                    onSelect={(e) => {
                        setVenue(e?.value ?? "");
                        if (e?.value) {
                            dropdownRef.current?.blur();
                        }
                    }}
                    style={styles.input}
                    clearButtonMode="while-editing"
                    items={user?.configuration.venues.knownVenueNames.map(
                        (venue) => ({
                            value: venue,
                            label: venue,
                        }),
                    )}
                />
                <SelectionInput
                    label="Company"
                    selectionMode="multi"
                    selection={company}
                    items={filteredUsers.map((user) => ({
                        value: user.userId,
                        label: `${user.firstName} ${user.lastName}`,
                    }))}
                    onChange={setCompany}
                    style={styles.input}
                />
                {!!watchlistEntry && !reviewId && (
                    <ToggleInput
                        label="Mark as watched"
                        value={clearWatchlistEntry}
                        onChange={setClearWatchlistEntry}
                        helpText={`${movie?.title} is currently in your watchlist. ${
                            clearWatchlistEntry
                                ? "It will be removed when this review is created."
                                : "It will remain there after this review is created."
                        }`}
                    />
                )}
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
            marginBottom: padding.large,
        },
    });
