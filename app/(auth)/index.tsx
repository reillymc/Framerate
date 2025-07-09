import { type FC, useCallback, useEffect, useRef, useState } from "react";
import {
    Platform,
    type TextInput as rnTextInput,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import Animated, {
    LinearTransition,
    ZoomInEasyUp,
    ZoomOutEasyUp,
} from "react-native-reanimated";
import { DeviceType, deviceType } from "expo-device";
import { useRouter } from "expo-router";
import {
    Action,
    Button,
    FormContainer,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useSession } from "@/modules/auth";

import { HostActions, Logo, ScreenLayout, StatusIndicator } from "@/components";
import { WebPageLayout } from "@/constants/layout";

const LoginScreen: FC = () => {
    const router = useRouter();
    const { signIn, error, host, clearError, isLoading, isSigningIn } =
        useSession();

    const styles = useThemedStyles(createStyles, {});

    const passwordRef = useRef<rnTextInput>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hideLogo, setHideLogo] = useState(false);

    const handleLogin = useCallback(() => {
        if (!(email && password)) return;

        signIn({ email, password });
    }, [email, password, signIn]);

    const handleHideLogo = useCallback(() => {
        if (deviceType !== DeviceType.PHONE) return;
        setHideLogo(true);
    }, []);

    useEffect(() => {
        if (isSigningIn) {
            clearError();
            return;
        }

        setPassword("");
    }, [isSigningIn, clearError]);

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
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <FormContainer>
                    <View style={styles.titleContainer}>
                        {Platform.OS === "web" ? (
                            <Text variant="title">Log In</Text>
                        ) : (
                            !hideLogo && (
                                <Animated.View
                                    exiting={ZoomOutEasyUp.springify().mass(
                                        0.7,
                                    )}
                                    entering={ZoomInEasyUp.springify().mass(
                                        0.7,
                                    )}
                                    layout={LinearTransition}
                                    style={styles.logoContainer}
                                >
                                    <Logo withTitle />
                                </Animated.View>
                            )
                        )}
                    </View>
                    <Animated.View
                        style={styles.form}
                        layout={LinearTransition.springify().mass(0.5)}
                    >
                        <StatusIndicator error={error} />
                        <TextInput
                            label="Email"
                            textContentType="username"
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            submitBehavior="submit"
                            maxLength={40}
                            disabled={isSigningIn}
                            value={email}
                            onChangeText={setEmail}
                            onFocus={handleHideLogo}
                            onBlur={() => setHideLogo(false)}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        <TextInput
                            ref={passwordRef}
                            label="Password"
                            textContentType="password"
                            clearButtonMode="while-editing"
                            maxLength={40}
                            secureTextEntry
                            disabled={isSigningIn}
                            value={password}
                            onFocus={handleHideLogo}
                            onBlur={() => setHideLogo(false)}
                            onChangeText={setPassword}
                            onSubmitEditing={handleLogin}
                        />
                        <Button
                            variant="primary"
                            label="Login"
                            onPress={handleLogin}
                            containerStyle={styles.confirmButton}
                            size="large"
                            disabled={
                                !(email && password) || isLoading || isSigningIn
                            }
                        />
                        <View style={styles.signUpContainer}>
                            <Text>Don't have an account? </Text>
                            <Action
                                onPress={() => {
                                    clearError();
                                    router.push({
                                        pathname: "/(auth)/register",
                                        params: { email },
                                    });
                                }}
                                label="Sign up"
                                variant="primary"
                            />
                        </View>
                    </Animated.View>
                </FormContainer>
            </ScrollView>
        </ScreenLayout>
    );
};

export default LoginScreen;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingTop: Platform.OS === "web" ? "15%" : undefined,
            ...WebPageLayout,
        },
        logoContainer: {
            paddingTop: Platform.OS !== "web" ? "15%" : undefined,
        },
        titleContainer: {
            marginBottom: spacing.medium,
            alignItems: "center",
        },
        signUpContainer: {
            flexDirection: "row",
            gap: spacing.tiny,
            marginTop: spacing.large,
            width: "100%",
            alignSelf: "center",
        },
        form: {
            alignItems: "center",
            width: Platform.OS === "web" ? "100%" : "80%",
            alignSelf: "center",
            gap: spacing.medium,
        },
        confirmButton: {
            marginTop: spacing.large,
        },
        settings: {
            position: "absolute",
            bottom: Platform.OS === "web" ? 32 : 64,
            right: Platform.OS === "web" ? 64 : "10%",
            left: Platform.OS === "web" ? 64 : "10%",
        },
    });
