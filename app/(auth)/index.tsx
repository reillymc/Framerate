import { HostActions, Logo, ScreenLayout } from "@/components";
import { WebPageLayout } from "@/constants/layout";
import { useSession } from "@/modules/auth";
import {
    Action,
    Button,
    Form,
    Icon,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useRouter } from "expo-router";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    View,
    type TextInput as rnTextInput,
} from "react-native";

const LoginScreen: FC = () => {
    const router = useRouter();
    const { signIn, error, host, isLoading, isSigningIn } = useSession();

    const styles = useThemedStyles(createStyles, {});

    const passwordRef = useRef<rnTextInput>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = useCallback(() => {
        if (!(email && password)) return;

        signIn({ email, password });
    }, [email, password, signIn]);

    useEffect(() => {
        if (isSigningIn) return;

        setPassword("");
    }, [isSigningIn]);

    return (
        <ScreenLayout
            tail={
                <HostActions
                    host={host}
                    style={styles.settings}
                    onSettingsPress={() => router.push("/(auth)/server")}
                />
            }
        >
            <ScrollView
                scrollEnabled={Platform.OS === "web"}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Form style={styles.form}>
                    <View style={styles.titleContainer}>
                        {Platform.OS === "web" ? (
                            <Text variant="title">Log In</Text>
                        ) : (
                            <Logo withTitle />
                        )}
                    </View>
                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon
                                iconName="exclamationcircle"
                                style={styles.hostWarningIcon}
                            />
                            <Text
                                variant="bodyEmphasized"
                                style={styles.errorText}
                            >
                                {error}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        label="Email"
                        width="full"
                        textContentType="username"
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        submitBehavior="submit"
                        disabled={isSigningIn}
                        value={email}
                        onChangeText={setEmail}
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <TextInput
                        ref={passwordRef}
                        label="Password"
                        width="full"
                        textContentType="password"
                        clearButtonMode="while-editing"
                        secureTextEntry
                        disabled={isSigningIn}
                        value={password}
                        onChangeText={setPassword}
                        onSubmitEditing={handleLogin}
                    />
                    <Button
                        label="Login"
                        onPress={handleLogin}
                        style={styles.confirmButton}
                        size="large"
                        disabled={
                            !(email && password) || isLoading || isSigningIn
                        }
                    />
                    <View style={styles.signUpContainer}>
                        <Text>Don't have an account? </Text>
                        <Action
                            onPress={() => router.push("/(auth)/register")}
                            label="Sign up"
                            variant="primary"
                        />
                    </View>
                </Form>
            </ScrollView>
        </ScreenLayout>
    );
};

export default LoginScreen;

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingTop: "15%",
            ...WebPageLayout,
        },
        titleContainer: {
            marginBottom: padding.regular,
            alignItems: "center",
        },
        errorText: {
            color: color.red,
        },
        signUpContainer: {
            flexDirection: "row",
            gap: padding.tiny,
            marginTop: padding.large,
            width: "100%",
            alignSelf: "center",
        },
        form: {
            alignItems: "center",
            width: Platform.OS === "web" ? "100%" : "80%",
            alignSelf: "center",
            gap: padding.regular,
        },
        confirmButton: {
            marginTop: padding.large,
        },
        settings: {
            position: "absolute",
            bottom: Platform.OS === "web" ? 32 : 64,
            right: Platform.OS === "web" ? 64 : "10%",
            left: Platform.OS === "web" ? 64 : "10%",
        },
        errorContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: padding.small,
        },
        hostWarningIcon: {
            color: color.destructive,
        },
    });
