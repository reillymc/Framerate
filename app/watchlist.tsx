import { TmdbImage } from "@/components";
import { useWatchlist } from "@/modules/watchlist";
import { useWatchlistEntries } from "@/modules/watchlistEntry";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useMemo } from "react";
import { Pressable, SectionList, StyleSheet, View } from "react-native";

const Watchlist: FC = () => {
    const { mediaType } = useLocalSearchParams<{ mediaType: string }>();

    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();

    const { data: watchlist } = useWatchlist(mediaType);
    const { data: entries = [] } = useWatchlistEntries(mediaType);

    const sectionData = useMemo(() => {
        const sections = Object.values(
            entries.reduce<
                Record<
                    string,
                    {
                        titleMonth: string | undefined;
                        titleYear: string | undefined;
                        data: WatchlistEntrySummary[];
                    }
                >
            >((acc, entry) => {
                const date = new Date(entry.mediaReleaseDate);
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();
                const key = `${month} ${year}`;

                const now = new Date();
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(now.getMonth() - 1);

                if (date < oneMonthAgo) {
                    if (acc.Older) {
                        acc.Older.data.push(entry);
                    } else {
                        acc.Older = {
                            titleYear: "Older",
                            titleMonth: undefined,
                            data: [entry],
                        };
                    }
                } else if (acc[key]) {
                    acc[key].data.push(entry);
                } else {
                    acc[key] = {
                        titleMonth: month,
                        titleYear: year.toString(),

                        data: [entry],
                    };
                }

                return acc;
            }, {}),
        );

        const uniqueSections: {
            titleMonth?: string;
            titleYear?: string;
            data: WatchlistEntrySummary[];
        }[] = [];
        const processedYears = new Set<string>();

        for (const section of sections) {
            if (section.titleYear) {
                if (processedYears.has(section.titleYear)) {
                    const { titleYear, ...rest } = section;
                    uniqueSections.push(rest);
                } else {
                    processedYears.add(section.titleYear);
                    uniqueSections.push(section);
                }
            } else if (section.titleYear === "Older") {
                uniqueSections.push(section);
            }
        }

        return uniqueSections;
    }, [entries]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: watchlist?.name ?? "...",
                    headerTransparent: false,
                }}
            />

            <SectionList
                sections={sectionData}
                renderSectionHeader={({ section }) => (
                    <View
                        style={{
                            flexDirection: "column-reverse",
                            backgroundColor: theme.color.background,
                            borderBottomColor: theme.color.border,
                            borderBottomWidth: 1,
                        }}
                    >
                        {section.titleMonth && (
                            <Text variant="title">{section.titleMonth}</Text>
                        )}
                        {section.titleYear && (
                            <Text
                                variant="display"
                                style={{
                                    paddingTop: theme.padding.small,
                                }}
                            >
                                {section.titleYear}
                            </Text>
                        )}
                    </View>
                )}
                stickySectionHeadersEnabled
                renderItem={({ item, section }) => {
                    const isOlder = section.titleYear === "Older";
                    return (
                        <Pressable
                            style={{
                                flexDirection: "row",
                                gap: 8,
                                marginTop: theme.padding.regular,
                            }}
                            onPress={() =>
                                router.push({
                                    pathname: "movie",
                                    params: { mediaId: item.mediaId },
                                })
                            }
                        >
                            <TmdbImage
                                path={item.mediaPosterUri}
                                type="poster"
                                style={{ borderRadius: 8 }}
                            />
                            <View style={{ flexShrink: 1 }}>
                                <Text variant="heading" numberOfLines={2}>
                                    {item.mediaTitle}
                                </Text>
                                <Text variant="body">
                                    {new Date(
                                        item.mediaReleaseDate,
                                    ).toLocaleDateString("en-AU", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: isOlder ? "numeric" : undefined,
                                    })}
                                </Text>
                            </View>
                        </Pressable>
                    );
                }}
                renderSectionFooter={() => (
                    <View
                        style={{
                            height: theme.padding.large,
                            backgroundColor: theme.color.background,
                        }}
                    />
                )}
                keyExtractor={(item) => item.mediaId.toString()}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
            />
        </>
    );
};

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.large,
        },
    });

export default Watchlist;
