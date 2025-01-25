import type { MediaType } from "@/constants/mediaTypes";
import { useColorScheme } from "@/hooks";
import type { MediaExternalLink } from "@/modules/meta";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { openURL } from "expo-linking";
import { type FC, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

interface MediaLinksProps
    extends Pick<
        MediaLinkProps,
        "mediaType" | "imdbId" | "tmdbId" | "seasonNumber" | "episodeNumber"
    > {
    mediaExternalLinks: MediaExternalLink[] | undefined;
}

export const MediaLinks: FC<MediaLinksProps> = ({
    mediaExternalLinks,
    ...props
}) => {
    const styles = useThemedStyles(createStyles, {});

    if (!mediaExternalLinks?.length) return null;

    return (
        <View style={styles.linksContainer}>
            {mediaExternalLinks.map((link) => (
                <MediaLink key={link.name} linkDetails={link} {...props} />
            ))}
        </View>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        linksContainer: {
            marginTop: spacing.large,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.medium,
            height: 50,
        },
    });

interface MediaLinkProps {
    linkDetails: MediaExternalLink;
    mediaType: MediaType;
    imdbId?: string;
    tmdbId?: number;
    seasonNumber?: number;
    episodeNumber?: number;
}

export const MediaLink: React.FunctionComponent<MediaLinkProps> = ({
    linkDetails,
    imdbId,
    tmdbId,
    mediaType,
    seasonNumber,
    episodeNumber,
}) => {
    const scheme = useColorScheme();

    const rawLink = linkDetails.links[mediaType];

    const [error, setError] = useState<Error>();

    if (!rawLink) return;

    const parsedLink = rawLink
        .replaceAll("{{imdbId}}", imdbId ?? "undefined")
        .replaceAll("{{tmdbId}}", tmdbId?.toString() ?? "undefined")
        .replaceAll("{{seasonNumber}}", seasonNumber?.toString() ?? "undefined")
        .replaceAll(
            "{{episodeNumber}}",
            episodeNumber?.toString() ?? "undefined",
        );

    if (parsedLink.includes("undefined")) return null;

    return (
        <Pressable onPress={() => openURL(parsedLink)}>
            <SvgCssUri
                width={60}
                height="100%"
                uri={
                    scheme === "dark" && linkDetails.icon.uriDark
                        ? linkDetails.icon.uriDark
                        : linkDetails.icon.uri
                }
                onError={setError}
            />
            {error && (
                <Text
                    style={{
                        textDecorationLine: "underline",
                    }}
                >
                    {linkDetails.name}
                </Text>
            )}
        </Pressable>
    );
};
