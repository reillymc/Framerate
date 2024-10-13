import {
    MediaFooterButtons,
    MediaLinks,
    TmdbImage,
    VidSrcButton,
} from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { ReviewDetailsCard, ReviewRatingTimeline } from "@/modules/review";
import { useSeason } from "@/modules/season";
import { useSeasonReviews } from "@/modules/seasonReview";
import { useShow } from "@/modules/show";
import { useCurrentUserConfig } from "@/modules/user";
import {
    Text,
    type ThemedStyles,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";

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
                            mediaType={MediaType.Season}
                            imdbId={show?.externalIds?.imdbId}
                            seasonNumber={seasonNumber}
                        />
                        {!!reviewList?.length && (
                            <>
                                <Text variant="title" style={styles.topMargin}>
                                    Watch History
                                </Text>
                                <ReviewRatingTimeline
                                    reviews={reviewList}
                                    starCount={configuration.ratings.starCount}
                                />
                                <FlatList
                                    contentInsetAdjustmentBehavior="automatic"
                                    scrollEnabled={false}
                                    data={reviewList}
                                    renderItem={({ item }) => (
                                        <ReviewDetailsCard
                                            key={item.reviewId}
                                            starCount={
                                                configuration.ratings.starCount
                                            }
                                            review={item}
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
                            <VidSrcButton
                                imdbId={show?.externalIds?.imdbId}
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
                        pathname: "/shows/season/editReview",
                        params: { showId, seasonNumber },
                    })
                }
                onAddWatch={() =>
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
    { theme: { padding, border } }: ThemedStyles,
    { fontScale, width }: { fontScale: number; width: number },
) => {
    const imageAspect = 5 / 7;
    const imageWidth = Math.floor(width * (2 / 5));
    const imageHeight = Math.floor(imageWidth * imageAspect * fontScale);

    return StyleSheet.create({
        container: {
            paddingBottom: 80,
            paddingHorizontal: padding.pageHorizontal,
        },
        topMargin: {
            marginTop: padding.large,
        },
        list: {
            marginTop: padding.large,
        },
        episode: {
            marginVertical: padding.regular,
            gap: padding.small,
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
            marginLeft: padding.small,
            justifyContent: "space-between",
        },
    });
};
