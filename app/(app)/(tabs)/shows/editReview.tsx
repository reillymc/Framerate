import { MediaType } from "@/constants/mediaTypes";
import { useSession } from "@/modules/auth";
import {
    ReviewForm,
    getRatingLabel,
    useReview,
    useSaveReview,
} from "@/modules/review";
import { useShow } from "@/modules/show";
import { useUser, useUsers } from "@/modules/user";
import {
    useDeleteWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";
import {
    Action,
    type ThemedStyles,
    ToggleInput,
    Undefined,
    type ValueItem,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";

const EditReview: FC = () => {
    const { reviewId, mediaId: mediaIdParam } = useGlobalSearchParams<{
        reviewId: string;
        mediaId: string;
    }>();

    const mediaId = mediaIdParam
        ? Number.parseInt(mediaIdParam ?? "", 10)
        : undefined;

    const { userId } = useSession();

    const { data: review } = useReview(reviewId);
    const { data: show } = useShow(mediaId ? mediaId : review?.mediaId);
    const router = useRouter();
    const { mutate: saveReview } = useSaveReview();
    const { data: users = [] } = useUsers();
    const { data: user } = useUser(userId);
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();

    const filteredUsers = users.filter((user) => user.userId !== userId);

    const styles = useThemedStyles(createStyles, {});

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [reviewDescription, setReviewDescription] = useState(
        review?.reviewDescription ?? "",
    );

    const [includeDate, setIncludeDate] = useState(
        review ? !!review.date : true,
    );
    const [clearWatchlistEntry, setClearWatchlistEntry] = useState(true);
    const [venue, setVenue] = useState(review?.venue);
    const [company, setCompany] = useState<ValueItem[]>(
        review?.company
            ?.map((user) => ({
                value: user.userId,
                label: `${user.firstName} ${user.lastName}`,
            }))
            .filter(Undefined) ?? [],
    );

    const { data: watchlistEntry } = useWatchlistEntry(MediaType.Show, mediaId);

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
        setRating(review?.rating ?? 0);
        setReviewDescription(review?.reviewDescription ?? "");
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const mediaIdValue = mediaId ?? review?.mediaId;

        if (!(rating && mediaIdValue)) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? date.toISOString().split("T")[0] : undefined,
            mediaId: mediaIdValue,
            mediaType: "show",
            venue,
            rating,
            reviewDescription,
            company: company.map(({ value }) => ({ userId: value })),
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteWatchlistEntry({
                mediaId: mediaIdValue,
                mediaType: MediaType.Show,
            });
        }
        handleClose();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: getRatingLabel(rating),
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
                <ReviewForm
                    companyOptions={filteredUsers}
                    rating={rating}
                    includeDate={includeDate}
                    date={date}
                    company={company}
                    description={reviewDescription}
                    venue={venue}
                    venueOptions={
                        user?.configuration.venues.knownVenueNames ?? []
                    }
                    onRatingChange={setRating}
                    onIncludeDateChange={setIncludeDate}
                    onDateChange={setDate}
                    onCompanyChange={setCompany}
                    onDescriptionChange={setReviewDescription}
                    onVenueChange={setVenue}
                />
                {!!watchlistEntry && !reviewId && (
                    <ToggleInput
                        label="Mark as watched"
                        value={clearWatchlistEntry}
                        onChange={setClearWatchlistEntry}
                        helpText={`${show?.name} is currently in your watchlist. ${
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

export default EditReview;

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
    });
