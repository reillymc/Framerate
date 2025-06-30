import { useMemo } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Undefined } from "@reillymc/es-utils";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useClientConfig } from "@/modules/meta";
import { RatingHistoryChart, ReviewTimelineItem } from "@/modules/review";
import { useSeason } from "@/modules/season";
import { useSeasonReviews } from "@/modules/seasonReview";
import { useShow } from "@/modules/show";
import { useCurrentUserConfig } from "@/modules/user";

import { MediaFooterButtons, MediaLinks, TmdbImage } from "@/components";
import { MediaType } from "@/constants/mediaTypes";

const Season: React.FC = () => {
    const {
        showId: showIdParam,
        seasonNumber: seasonNumberParam,
        name,
    } = useLocalSearchParams<{
        showId: string;
        seasonNumber: string;
        name?: string;
    }>();

    const router = useRouter();

    const showId = showIdParam ? Number.parseInt(showIdParam, 10) : undefined;
    const seasonNumber = seasonNumberParam
        ? Number.parseInt(seasonNumberParam, 10)
        : undefined;
    const { fontScale, width } = useWindowDimensions();

    const { configuration } = useCurrentUserConfig();
    const { data: clientConfig } = useClientConfig();
    const { data: show } = useShow(showId);
    const { data: season } = useSeason(showId, seasonNumber);
    const { data: reviews } = useSeasonReviews({ showId, seasonNumber });

    const reviewList = useMemo(
        () => reviews?.pages.flat().filter(Undefined) ?? [],
        [reviews],
    );

    const airDate = season?.airDate
        ? new Date(season.airDate).toLocaleString("default", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : undefined;

    const styles = useThemedStyles(createStyles, { fontScale, width });

    return (
        <>
            <Stack.Screen options={{ title: season?.name ?? name }} />
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
                data={season?.episodes}
                initialNumToRender={season?.episodes?.length} // Issue in FlatList: https://github.com/facebook/react-native/issues/36766#issuecomment-1853107471
                keyExtractor={({ episodeNumber }) => episodeNumber.toString()}
                ListHeaderComponent={
                    <>
                        <Text variant="body">{season?.overview}</Text>
                        {airDate && (
                            <Text
                                variant="bodyEmphasized"
                                style={styles.topMargin}
                            >
                                {`First Aired: ${airDate}`}
                            </Text>
                        )}
                        <MediaLinks
                            mediaExternalLinks={
                                clientConfig?.mediaExternalLinks
                            }
                            mediaType={MediaType.Season}
                            imdbId={show?.externalIds?.imdbId}
                            tmdbId={show?.id}
                            seasonNumber={seasonNumber}
                        />
                        {!!reviewList?.length && (
                            <>
                                <Text variant="title" style={styles.topMargin}>
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
                                                    pathname:
                                                        "/shows/season/review",
                                                    params: {
                                                        reviewId: item.reviewId,
                                                    },
                                                })
                                            }
                                        />
                                    )}
                                    style={styles.list}
                                />
                            </>
                        )}
                        <Text variant="title" style={styles.topMargin}>
                            Episodes
                        </Text>
                    </>
                }
                renderItem={({ item }) => {
                    const airDate = item?.airDate
                        ? new Date(item.airDate).toLocaleString("default", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                          })
                        : undefined;

                    return (
                        <View style={styles.episode}>
                            <View style={styles.episodeInnerContainer}>
                                <TmdbImage
                                    path={item.stillPath ?? show?.backdropPath}
                                    type="backdrop"
                                    style={styles.episodeImage}
                                />
                                <View style={styles.episodeDetails}>
                                    <View>
                                        {item.name && (
                                            <Text variant="caption">
                                                {`Episode ${item.episodeNumber}`}
                                            </Text>
                                        )}
                                        <Text
                                            variant="heading"
                                            numberOfLines={2}
                                        >
                                            {item.name ??
                                                `Episode ${item.episodeNumber}`}
                                        </Text>
                                    </View>
                                    {airDate && (
                                        <Text variant="body">{airDate}</Text>
                                    )}
                                </View>
                            </View>
                            {item.overview && (
                                <Text variant="caption">{item.overview}</Text>
                            )}
                            <MediaLinks
                                mediaExternalLinks={
                                    clientConfig?.mediaExternalLinks
                                }
                                mediaType={MediaType.Episode}
                                imdbId={show?.externalIds?.imdbId}
                                tmdbId={show?.id}
                                episodeNumber={item.episodeNumber}
                                seasonNumber={seasonNumber}
                            />
                        </View>
                    );
                }}
            />
            <MediaFooterButtons
                onAddReview={() =>
                    router.push({
                        pathname: "/shows/season/editWatch",
                        params: { showId, seasonNumber },
                    })
                }
            />
        </>
    );
};

export default Season;

const createStyles = (
    { theme: { spacing, border } }: ThemedStyles,
    { fontScale, width }: { fontScale: number; width: number },
) => {
    const imageAspect = 5 / 7;
    const imageWidth = Math.floor(width * (2 / 5));
    const imageHeight = Math.floor(imageWidth * imageAspect * fontScale);

    return StyleSheet.create({
        container: {
            paddingBottom: 80,
            paddingHorizontal: spacing.pageHorizontal,
        },
        topMargin: {
            marginTop: spacing.large,
        },
        list: {
            marginTop: spacing.large,
        },
        episode: {
            marginVertical: spacing.medium,
            gap: spacing.small,
        },
        episodeImage: {
            width: imageWidth,
            height: imageHeight,
            borderRadius: border.radius.regular,
        },
        episodeInnerContainer: {
            flexDirection: "row",
        },
        episodeDetails: {
            flex: 1,
            marginLeft: spacing.small,
            justifyContent: "space-between",
        },
    });
};
