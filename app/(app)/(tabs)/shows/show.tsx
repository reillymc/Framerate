import { type FC, useMemo } from "react";
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import { Undefined } from "@reillymc/es-utils";
import {
    IconAction,
    Tag,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useClientConfig } from "@/modules/meta";
import { RatingHistoryChart, ReviewTimelineItem } from "@/modules/review";
import { useShow } from "@/modules/show";
import {
    useFilteredShowCollections,
    useSaveShowCollectionEntry,
} from "@/modules/showCollection";
import { useShowReviews } from "@/modules/showReview";
import {
    useDeleteShowWatchlistEntry,
    useSaveShowWatchlistEntry,
    useShowWatchlistEntry,
} from "@/modules/showWatchlist";
import { useCurrentUserConfig } from "@/modules/user";

import {
    ContextMenu,
    MediaHeaderButtons,
    MediaLinks,
    ParallaxScrollView,
    Poster,
    ScreenLayout,
    TmdbImage,
    usePosterDimensions,
} from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { displayFull } from "@/helpers/dateHelper";

const Show: FC = () => {
    const {
        id: idParam,
        name,
        posterPath,
    } = useLocalSearchParams<{
        id: string;
        name?: string;
        posterPath?: string;
    }>();

    const showId = idParam ? Number.parseInt(idParam, 10) : undefined;

    const router = useRouter();

    const { data: show } = useShow(showId);
    const { configuration } = useCurrentUserConfig();
    const { data: clientConfig } = useClientConfig();
    const { data: reviews, refetch } = useShowReviews({ showId });
    const { data: watchlistEntry } = useShowWatchlistEntry(showId);
    const { mutate: deleteWatchlistEntry } = useDeleteShowWatchlistEntry();
    const { mutate: saveWatchlistEntry } = useSaveShowWatchlistEntry();
    const { mutate: saveCollectionEntry } = useSaveShowCollectionEntry();
    const { collectionsContainingShow, collectionsNotContainingShow } =
        useFilteredShowCollections(showId);

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const heroPoster = usePosterDimensions({
        size: "small",
    });

    const seasonPoster = usePosterDimensions({
        size: "large",
        teaseSpacing: true,
    });

    const castPoster = usePosterDimensions({
        size: "small",
        teaseSpacing: true,
    });

    const firstAirDate = displayFull(show?.firstAirDate);

    const styles = useThemedStyles(createStyles, {
        posterWidth: heroPoster.interval,
        posterHeight: heroPoster.height,
    });

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: show?.name ?? name,
                        headerRight: () => (
                            <MediaHeaderButtons
                                onWatchlist={!!watchlistEntry}
                                onAddReview={() =>
                                    router.push({
                                        pathname: "/shows/editWatch",
                                        params: { showId },
                                    })
                                }
                                onToggleWatchlist={() => {
                                    if (!showId) return;

                                    if (watchlistEntry) {
                                        deleteWatchlistEntry({ showId });
                                        return;
                                    }

                                    saveWatchlistEntry({ showId });
                                }}
                            />
                        ),
                    }}
                />
            }
        >
            <ParallaxScrollView
                headerImage={
                    <TmdbImage type="backdrop" path={show?.backdropPath} />
                }
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
                scrollIndicatorInsets={{ top: 330, bottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
            >
                <Poster
                    style={styles.floatingPoster}
                    size="small"
                    removeMargin
                    imageUri={show?.posterPath ?? posterPath}
                />
                <View style={styles.floatingTagline}>
                    <Text variant="heading" numberOfLines={3}>
                        {show?.tagline}
                    </Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.collections}
                >
                    {collectionsContainingShow?.map(
                        ({ name, collectionId }) => (
                            <Tag
                                key={collectionId}
                                label={name}
                                variant="light"
                            />
                        ),
                    )}
                    {!!collectionsNotContainingShow?.length && (
                        <ContextMenu
                            menuConfig={{
                                menuTitle: "Select Collection",
                                menuItems: collectionsNotContainingShow.map(
                                    ({ collectionId, name }) => ({
                                        actionKey: collectionId,
                                        actionTitle: name,
                                    }),
                                ),
                            }}
                            onPressMenuAction={({ actionKey }) => {
                                if (!show) return;
                                saveCollectionEntry({
                                    collectionId: actionKey,
                                    showId: show.id,
                                });
                                return;
                            }}
                        >
                            <IconAction
                                iconSet={Octicons}
                                iconName="book"
                                label="Save to collection"
                            />
                        </ContextMenu>
                    )}
                </ScrollView>
                <View style={styles.pageContent}>
                    <Text variant="body" style={styles.element}>
                        {show?.overview}
                    </Text>
                    {show?.seasons && (
                        <FlatList
                            horizontal
                            data={show?.seasons}
                            style={styles.seasonsList}
                            ListFooterComponent={<View style={{ width: 16 }} />}
                            keyExtractor={({ seasonNumber }) =>
                                seasonNumber.toString()
                            }
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            snapToInterval={seasonPoster.interval}
                            renderItem={({ item }) => (
                                <Poster
                                    {...seasonPoster.configuration}
                                    imageUri={
                                        item.posterPath ?? show.posterPath
                                    }
                                    heading={
                                        item.name ??
                                        `Season ${item.seasonNumber}`
                                    }
                                    onPress={() =>
                                        router.push({
                                            pathname: "/shows/season",
                                            params: {
                                                showId: show.id,
                                                seasonNumber: item.seasonNumber,
                                                name: item.name,
                                            },
                                        })
                                    }
                                />
                            )}
                        />
                    )}
                    {firstAirDate && (
                        <Text
                            variant="bodyEmphasized"
                            style={[styles.section, styles.element]}
                        >
                            {`First Aired: ${firstAirDate}`}
                        </Text>
                    )}
                    {!!reviewList?.length && (
                        <View style={styles.element}>
                            <Text variant="title" style={styles.section}>
                                Watch History
                            </Text>
                            <RatingHistoryChart
                                reviews={reviewList}
                                starCount={configuration.ratings.starCount}
                            />
                            <FlatList
                                contentInsetAdjustmentBehavior="automatic"
                                scrollEnabled={false}
                                data={reviewList}
                                renderItem={({ item, index }) => (
                                    <ReviewTimelineItem
                                        key={item.reviewId}
                                        starCount={
                                            configuration.ratings.starCount
                                        }
                                        review={item}
                                        hideTimeline={
                                            index === reviewList.length - 1
                                        }
                                        onPress={() =>
                                            router.push({
                                                pathname: "/shows/watch",
                                                params: {
                                                    reviewId: item.reviewId,
                                                },
                                            })
                                        }
                                    />
                                )}
                                contentContainerStyle={styles.list}
                            />
                        </View>
                    )}
                </View>
                {!!show?.credits?.cast.length && (
                    <>
                        <Text variant="title" style={styles.sectionHeading}>
                            Cast
                        </Text>
                        <FlatList
                            horizontal
                            data={show.credits.cast}
                            contentContainerStyle={styles.castList}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            snapToInterval={castPoster.interval}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Poster
                                    key={item.id}
                                    imageUri={item.profilePath}
                                    heading={item.name}
                                    subHeading={item.roles
                                        ?.map((role) => role.character)
                                        .join(", ")}
                                    {...castPoster.configuration}
                                />
                            )}
                        />
                    </>
                )}

                <MediaLinks
                    mediaExternalLinks={clientConfig?.mediaExternalLinks}
                    mediaType={MediaType.Show}
                    tmdbId={show?.id}
                    imdbId={show?.externalIds?.imdbId}
                />
            </ParallaxScrollView>
        </ScreenLayout>
    );
};

export default Show;

const createStyles = (
    { theme: { color, spacing, border } }: ThemedStyles,
    {
        posterWidth,
        posterHeight,
    }: { posterWidth: number; posterHeight: number },
) =>
    StyleSheet.create({
        container: {
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.pageBottom,
            backgroundColor: color.background,
            borderRadius: border.radius.loose,
        },
        floatingPoster: {
            position: "absolute",
            top: -(posterHeight / (7 / 4)),
            left: spacing.pageHorizontal + spacing.small,
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        },
        floatingTagline: {
            left: spacing.pageHorizontal + posterWidth + spacing.medium,
            top: -spacing.small,
            width: "55%",
            height: 70,
            justifyContent: "center",
        },
        collections: {
            paddingTop: spacing.large,
            paddingHorizontal: spacing.pageHorizontal,
            alignItems: "center",
        },
        pageContent: {
            marginTop: spacing.medium,
        },
        seasonsList: {
            paddingTop: spacing.large,
            paddingHorizontal: spacing.pageHorizontal,
        },
        list: {
            marginTop: spacing.large,
        },
        element: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        section: {
            marginTop: spacing.large,
        },
        castList: {
            marginTop: spacing.medium,
            paddingHorizontal: spacing.pageHorizontal,
        },
        sectionHeading: {
            marginTop: spacing.medium,
            paddingHorizontal: spacing.pageHorizontal,
        },
    });
