import { ErrorIndicator, ScreenLayout } from "@/components";
import { useFramerateServices } from "@/hooks";
import {
    Action,
    Button,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { setUrlAsync } from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import { type FC, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
const Profile: FC = () => {
    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const { administration } = useFramerateServices();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"pending" | "errored" | "success">(
        "pending",
    );

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
                automaticallyAdjustKeyboardInsets
                contentContainerStyle={styles.container}
            >
                <View>
                    <Text variant="title">Create Invite Link</Text>
                    <TextInput
                        label="User Email"
                        value={email}
                        onChangeText={setEmail}
                        containerStyle={styles.sectionElement}
                    />
                    <Button
                        label="Submit"
                        onPress={() =>
                            administration
                                ?.generateInvite({ inviteDetails: { email } })
                                .then((inviteCode) => {
                                    const inviteLink = `framerate://register?inviteCode=${inviteCode}`;
                                    setUrlAsync(inviteLink);
                                    setEmail("");
                                    setStatus("success");
                                })
                                .catch(() => setStatus("errored"))
                        }
                    />
                    {status === "errored" && (
                        <ErrorIndicator
                            error={
                                "An error occurred when generating the requested invite code"
                            }
                        />
                    )}
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
        sectionElement: {
            marginTop: padding.regular,
            marginBottom: padding.regular,
        },
    });

export default Profile;
