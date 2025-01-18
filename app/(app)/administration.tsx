import { ScreenLayout, StatusIndicator } from "@/components";
import { useFramerateServices } from "@/hooks";
import {
    Action,
    Button,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { setStringAsync, setUrlAsync } from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import { type FC, useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
const Profile: FC = () => {
    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const { administration } = useFramerateServices();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        "pending" | "errored" | "success" | "loading"
    >("pending");

    useEffect(() => {
        console.log(status);
    }, [status]);

    const onGenerateLink = useCallback(() => {
        if (!(administration && email)) return;

        setStatus("loading");

        administration
            .generateInvite({ inviteDetails: { email } })
            .then((inviteCode) => {
                const inviteLink = `framerate://register?inviteCode=${inviteCode}`;
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
                        size="regular"
                        disabled={!email || status === "loading"}
                        style={styles.submitButton}
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
            </ScrollView>
        </ScreenLayout>
    );
};

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
        },
        section: {
            marginLeft: padding.regular,
        },
        sectionElement: {
            marginTop: padding.regular,
        },
        submitButton: {
            marginTop: padding.large,
            marginBottom: padding.regular,
        },
    });

export default Profile;
