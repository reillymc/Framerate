import { Logo, ScreenLayout } from "@/components";
import { useSession } from "@/modules/auth";
import {
    Action,
    Button,
    Form,
    IconActionV2,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useRouter } from "expo-router";
import { type FC, useCallback, useRef, useState } from "react";
import {
    Platform,
    StyleSheet,
    View,
    type TextInput as rnTextInput,
} from "react-native";

const LoginScreen: FC = () => {
    const router = useRouter();
    const { signIn } = useSession();

    const styles = useThemedStyles(createStyles, {});

    const passwordRef = useRef<rnTextInput>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = useCallback(() => {
        if (!(email && password)) return;

        signIn({ email, password });
        router.replace("/movies");
    }, [router, email, password, signIn]);

    return (
        <ScreenLayout
            meta={
                <View style={styles.settingsButton}>
                    <IconActionV2 iconName="gear" variant="flat" size="large" />
                </View>
            }
        >
            <Form style={styles.container}>
                <View style={styles.titleContainer}>
                    {Platform.OS === "web" ? (
                        <Text variant="title">Log In or Register</Text>
                    ) : (
                        <>
                            <Logo />
                            <Text variant="display">Framerate</Text>
                        </>
                    )}
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Email"
                        width="full"
                        textContentType="username"
                        autoCapitalize="none"
                        value={email}
                        clearButtonMode="while-editing"
                        onChangeText={setEmail}
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        submitBehavior="submit"
                    />
                    <TextInput
                        ref={passwordRef}
                        label="Password"
                        width="full"
                        textContentType="password"
                        secureTextEntry={true}
                        value={password}
                        clearButtonMode="while-editing"
                        onChangeText={setPassword}
                        onSubmitEditing={handleLogin}
                    />
                    <Button
                        label="Login"
                        onPress={handleLogin}
                        style={styles.confirmButton}
                        size="large"
                        disabled={!(email && password)}
                    />
                </View>
                <View style={styles.signUpContainer}>
                    <Text>Don't have an account? </Text>
                    <Action
                        onPress={() => null}
                        label="Sign up"
                        variant="primary"
                    />
                </View>
            </Form>
        </ScreenLayout>
    );
};

export default LoginScreen;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            marginVertical: "30%",
            flex: 1,
        },
        titleContainer: {
            marginBottom: 48,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
        },
        signUpContainer: {
            flexDirection: "row",
            gap: padding.tiny,
            marginTop: padding.large,
            width: Platform.OS === "web" ? "100%" : "70%",
            alignSelf: "center",
        },
        form: {
            alignItems: "center",
            width: Platform.OS === "web" ? "100%" : "70%",
            alignSelf: "center",
            gap: padding.regular,
        },
        confirmButton: {
            marginTop: padding.large,
        },
        settingsButton: {
            position: "absolute",
            bottom: Platform.OS === "web" ? 32 : 64,
            width: Platform.OS === "web" ? "100%" : "70%",
            alignItems: "flex-end",
            marginRight: Platform.OS === "web" ? 64 : 0,
            alignSelf: "center",
        },
    });
