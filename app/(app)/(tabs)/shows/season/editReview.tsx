import { useSession } from "@/modules/auth";
import { ReviewForm, getRatingLabel } from "@/modules/review";
import { useSaveSeasonReview, useSeasonReview } from "@/modules/seasonReview";
import { useCurrentUserConfig, useUsers } from "@/modules/user";
import {
    Action,
    type ThemedStyles,
    Undefined,
    type ValueItem,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";

const EditReview: FC = () => {
    const {
        reviewId,
        showId: showIdParam,
        seasonNumber: seasonNumberParam,
    } = useGlobalSearchParams<{
        reviewId: string;
        showId: string;
        seasonNumber?: string;
    }>();

    const showId = showIdParam
        ? Number.parseInt(showIdParam ?? "", 10)
        : undefined;

    const seasonNumber = seasonNumberParam
        ? Number.parseInt(seasonNumberParam ?? "", 10)
        : undefined;

    const { userId } = useSession();

    const { data: review } = useSeasonReview(reviewId);

    const router = useRouter();
    const { mutate: saveReview } = useSaveSeasonReview();
    const { data: users = [] } = useUsers();
    const { configuration } = useCurrentUserConfig();

    const filteredUsers = users.filter((user) => user.userId !== userId);

    const styles = useThemedStyles(createStyles, {});

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [description, setDescription] = useState(review?.description ?? "");

    const [includeDate, setIncludeDate] = useState(
        review ? !!review.date : true,
    );
    const [venue, setVenue] = useState(review?.venue);
    const [company, setCompany] = useState<ValueItem[]>(
        review?.company
            ?.map((user) => ({
                value: user.userId,
                label: `${user.firstName} ${user.lastName}`,
            }))
            .filter(Undefined) ?? [],
    );

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
        setRating(review?.rating ?? 0);
        setDescription(review?.description ?? "");
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const showIdValue = showId ?? review?.season.showId;
        const seasonNumberValue = seasonNumber ?? review?.season.seasonNumber;

        if (!(rating && showIdValue && seasonNumberValue)) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? date.toISOString().split("T")[0] : undefined,
            showId: showIdValue,
            seasonNumber: seasonNumberValue,
            venue,
            rating,
            description,
            company: company.map(({ value }) => ({ userId: value })),
        });

        handleClose();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: getRatingLabel(
                        rating,
                        configuration.ratings.starCount,
                    ),
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
                    description={description}
                    venue={venue}
                    starCount={configuration.ratings.starCount}
                    venueOptions={configuration.venues.knownVenueNames}
                    onRatingChange={setRating}
                    onIncludeDateChange={setIncludeDate}
                    onDateChange={setDate}
                    onCompanyChange={setCompany}
                    onDescriptionChange={setDescription}
                    onVenueChange={setVenue}
                />
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
