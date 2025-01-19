import { HostActions, ScreenLayout, StatusIndicator } from "@/components";
import { WebPageLayout } from "@/constants/layout";
import { useSession } from "@/modules/auth";
import {
    Action,
    Button,
    Form,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import {
    Platform,
    StyleSheet,
    View,
    type TextInput as rnTextInput,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const RegisterScreen: FC = () => {
    const router = useRouter();
    const { inviteCode, email: emailParam } = useLocalSearchParams<{
        inviteCode: string;
        email: string;
    }>();

    const { register, error, isSigningIn, clearError, host } = useSession();

    const styles = useThemedStyles(createStyles, {});

    const firstNameRef = useRef<rnTextInput>(null);
    const lastNameRef = useRef<rnTextInput>(null);
    const passwordRef = useRef<rnTextInput>(null);

    const [email, setEmail] = useState(emailParam ?? "");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleRegister = useCallback(() => {
        if (!(email && password)) return;

        register({ email, password, firstName, lastName, inviteCode });
    }, [email, password, firstName, lastName, inviteCode, register]);

    useEffect(() => {
        if (isSigningIn) {
            clearError();
            return;
        }

        setPassword("");
    }, [isSigningIn, clearError]);

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: "Register Account",
                        headerLeft: () => (
                            <Action
                                label="Cancel"
                                onPress={() => {
                                    clearError();
                                    router.back();
                                }}
                            />
                        ),
                    }}
                />
            }
            tail={
                Platform.OS === "web" && (
                    <HostActions
                        host={host}
                        style={styles.settings}
                        onSettingsPress={() => router.push("/(auth)/server")}
                    />
                )
            }
        >
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <Form style={styles.form}>
                    {Platform.OS === "web" && (
                        <View style={styles.titleContainer}>
                            <Text variant="title">Register Account</Text>
                        </View>
                    )}
                    <StatusIndicator error={error} />
                    <TextInput
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        label="Email"
                        submitBehavior="submit"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        width="full"
                        value={email}
                        onChangeText={setEmail}
                        onSubmitEditing={() => firstNameRef.current?.focus()}
                    />
                    <View style={styles.nameInputContainer}>
                        <TextInput
                            ref={firstNameRef}
                            clearButtonMode="while-editing"
                            label="First Name"
                            submitBehavior="submit"
                            textContentType="givenName"
                            value={firstName}
                            onChangeText={setFirstName}
                            onSubmitEditing={() => lastNameRef.current?.focus()}
                        />
                        <TextInput
                            ref={lastNameRef}
                            clearButtonMode="while-editing"
                            label="Last Name"
                            submitBehavior="submit"
                            textContentType="familyName"
                            value={lastName}
                            onChangeText={setLastName}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                    </View>
                    <TextInput
                        ref={passwordRef}
                        clearButtonMode="while-editing"
                        label="Password"
                        textContentType="password"
                        width="full"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onSubmitEditing={handleRegister}
                    />
                    <Button
                        label="Register"
                        onPress={handleRegister}
                        style={styles.confirmButton}
                        size="large"
                        disabled={!(email && password)}
                    />
                    {Platform.OS === "web" ? (
                        <View style={styles.logInContainer}>
                            <Text>Already have an account?</Text>
                            <Action
                                onPress={() => {
                                    clearError();
                                    router.replace("/(auth)");
                                }}
                                label="Log in"
                                variant="primary"
                            />
                        </View>
                    ) : (
                        <HostActions
                            host={host}
                            style={styles.settings}
                            onSettingsPress={() =>
                                router.push("/(auth)/server")
                            }
                        />
                    )}
                </Form>
            </ScrollView>
        </ScreenLayout>
    );
};

export default RegisterScreen;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingBottom: "100%",
            ...WebPageLayout,
        },
        form: {
            alignItems: "center",
            width: "100%",
            paddingHorizontal:
                Platform.OS === "web" ? undefined : spacing.pageHorizontal,
            alignSelf: "center",
            paddingTop: Platform.OS === "web" ? undefined : spacing.medium,
            gap: spacing.medium,
        },
        titleContainer: {
            marginBottom: spacing.medium,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.small,
            justifyContent: "center",
        },
        nameInputContainer: {
            flexDirection: "row",
            gap: spacing.medium,
            width: "100%",
        },
        confirmButton: {
            marginTop: spacing.large,
            marginBottom: spacing.medium,
        },
        logInContainer: {
            flexDirection: "row",
            gap: spacing.tiny,
            marginTop: spacing.large,
            width: "100%",
            alignSelf: "flex-start",
        },
        settings: {
            position: Platform.OS === "web" ? "absolute" : undefined,
            bottom: Platform.OS === "web" ? 32 : undefined,
            right: Platform.OS === "web" ? 32 : undefined,
            left: Platform.OS === "web" ? 32 : undefined,
            width: Platform.OS === "web" ? undefined : "100%",
        },
    });
