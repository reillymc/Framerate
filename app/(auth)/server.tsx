import type { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import {
    Action,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useSession } from "@/modules/auth";

import { ScreenLayout } from "@/components";
import { WebPageModal } from "@/constants/layout";

const ServerScreen: FC = () => {
    const router = useRouter();

    const styles = useThemedStyles(createStyles, {});

    const { host, setHost } = useSession();

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: "Custom Host Address",
                        headerRight: () => (
                            <Action label="Done" onPress={router.back} />
                        ),
                    }}
                />
            }
            options={{ web: { modal: true } }}
        >
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={WebPageModal}
                contentContainerStyle={styles.container}
            >
                {Platform.OS === "web" && (
                    <View style={styles.titleContainer}>
                        <Text variant="title">Custom Host Address</Text>
                    </View>
                )}
                <TextInput
                    textContentType="URL"
                    keyboardType="url"
                    autoFocus
                    autoCapitalize="none"
                    placeholder="https://www.framerateapi.my-server.com"
                    value={host ?? ""}
                    clearButtonMode="always"
                    onChangeText={setHost}
                    onSubmitEditing={router.back}
                    containerStyle={styles.hostInput}
                    helpText="Enter a custom Framerate host to login with, or leave blank for default"
                />
            </ScrollView>
        </ScreenLayout>
    );
};

export default ServerScreen;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: spacing.pageHorizontal + spacing.medium,
        },
        titleContainer: {
            marginBottom: spacing.medium,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.small,
            justifyContent: "center",
        },
        hostInput: {
            marginTop: spacing.small,
        },
    });
