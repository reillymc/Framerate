import { type FC, useCallback, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { setStringAsync, setUrlAsync } from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import {
    Action,
    Button,
    Text,
    TextInput,
    type ThemedStyles,
    ToggleInput,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useClientConfig, useSaveClientConfig } from "@/modules/meta";

import { Accordion, ScreenLayout, StatusIndicator } from "@/components";
import { useFramerateServices } from "@/hooks";

import app from "../../app.json";

const Profile: FC = () => {
    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const { administration } = useFramerateServices();
    const { data: clientConfig } = useClientConfig();
    const { mutate: updateClientConfig } = useSaveClientConfig();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        "pending" | "errored" | "success" | "loading"
    >("pending");

    const onGenerateLink = useCallback(() => {
        if (!(administration && email)) return;

        setStatus("loading");

        administration
            .generateInvite({ inviteDetails: { email } })
            .then((inviteCode) => {
                const inviteLink = `${app.expo.scheme}://register?inviteCode=${inviteCode}`;
                if (Platform.OS === "ios") {
                    setUrlAsync(inviteLink);
                } else {
                    setStringAsync(inviteLink);
                }
                setEmail("");
                setStatus("success");
            })
            .catch(() => setStatus("errored"));
    }, [administration, email]);

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: "Administration",
                        headerLeft: () => (
                            <Action label="Done" onPress={router.back} />
                        ),
                    }}
                />
            }
        >
            <ScrollView
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <Text variant="title">Create Invite Link</Text>
                <View style={styles.section}>
                    <TextInput
                        disabled={status === "loading"}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        label="Recipient Email"
                        textContentType="emailAddress"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setStatus("pending")}
                        onSubmitEditing={onGenerateLink}
                        containerStyle={styles.sectionElement}
                    />
                    <Button
                        label="Submit"
                        onPress={onGenerateLink}
                        disabled={!email || status === "loading"}
                        containerStyle={styles.submitButton}
                    />
                    <StatusIndicator
                        error={
                            status === "errored"
                                ? "An error occurred when generating the invite link"
                                : undefined
                        }
                        success={
                            status === "success"
                                ? "Invitation link copied to clipboard"
                                : undefined
                        }
                    />
                </View>
                <Text variant="title">Media Links</Text>
                <View style={styles.section}>
                    <Text variant="caption">
                        Configure external media links to display under movies,
                        shows, seasons and episodes.
                    </Text>
                    <Text variant="caption">
                        Available variable substitutions are "tmdbId", "imdbId",
                        "seasonNumber" and "episodeNumber".
                    </Text>
                    <Text variant="caption">
                        Example usage: "
                        {"https://www.site.com/movie/{{tmdbId}}"}".
                    </Text>
                    {clientConfig?.mediaExternalLinks?.map((mediaLink, idx) => (
                        <View key={mediaLink.name} style={styles.linkContainer}>
                            <ToggleInput
                                label={mediaLink.name}
                                iconVariant="check"
                                value={mediaLink.enabled}
                                onChange={(value) => {
                                    const newLinks = [
                                        ...(clientConfig?.mediaExternalLinks ??
                                            []),
                                    ];

                                    newLinks[idx] = {
                                        ...mediaLink,
                                        enabled: value,
                                    };

                                    return updateClientConfig({
                                        clientConfig: {
                                            ...clientConfig,
                                            mediaExternalLinks: newLinks,
                                        },
                                    });
                                }}
                            />
                            <Accordion
                                collapsed={!mediaLink.enabled}
                                style={styles.linkLinksContainer}
                            >
                                <TextInput
                                    label="Movie"
                                    disabled
                                    containerStyle={styles.sectionElement}
                                    value={mediaLink.links.movie}
                                />
                                <TextInput
                                    label="Show"
                                    disabled
                                    containerStyle={styles.sectionElement}
                                    value={mediaLink.links.show}
                                />
                                <TextInput
                                    label="Season"
                                    disabled
                                    containerStyle={styles.sectionElement}
                                    value={mediaLink.links.season}
                                />
                                <TextInput
                                    label="Episode"
                                    disabled
                                    containerStyle={styles.sectionElement}
                                    value={mediaLink.links.episode}
                                />
                            </Accordion>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.pageBottom,
        },
        section: {
            marginLeft: spacing.medium,
        },
        sectionElement: {
            marginTop: spacing.medium,
        },
        submitButton: {
            marginTop: spacing.large,
            marginBottom: spacing.large * 2,
        },
        linkContainer: {
            marginTop: spacing.medium,
        },
        linkLinksContainer: {
            marginBottom: spacing.large,
            marginLeft: spacing.large,
        },
    });

export default Profile;
