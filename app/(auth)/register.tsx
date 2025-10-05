import {
    type FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Platform,
    type TextInput as rnTextInput,
    StyleSheet,
    View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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

import {
    HeaderCloseAction,
    HostActions,
    ScreenLayout,
    StatusIndicator,
} from "@/components";
import { WebPageLayout } from "@/constants/layout";

const emailValidator = /^\S+@\S+\.\S+$/;

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

    const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>();

    const formValid = useMemo(
        () => email && password && firstName && lastName && !isEmailInvalid,
        [email, password, firstName, lastName, isEmailInvalid],
    );

    const handleRegister = useCallback(() => {
        if (!formValid) return;

        register({
            email: email.toLocaleLowerCase(),
            password,
            firstName,
            lastName,
            inviteCode,
        });
    }, [email, password, firstName, lastName, inviteCode, formValid, register]);

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
                            <HeaderCloseAction
                                label="Cancel"
                                onClose={router.back}
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
                <FormContainer style={styles.form}>
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
                        maxLength={60}
                        value={email}
                        hasError={isEmailInvalid}
                        helpText={
                            isEmailInvalid
                                ? "Please enter a valid email address"
                                : undefined
                        }
                        onChangeText={setEmail}
                        onChange={({ nativeEvent }) => {
                            if (isEmailInvalid === undefined) return;
                            setIsEmailInvalid(
                                !emailValidator.test(nativeEvent.text),
                            );
                        }}
                        onEndEditing={({ nativeEvent }) => {
                            if (nativeEvent.text === undefined) return;

                            setIsEmailInvalid(
                                !emailValidator.test(nativeEvent.text),
                            );
                        }}
                        onSubmitEditing={() => firstNameRef.current?.focus()}
                    />
                    <View style={styles.nameInputContainer}>
                        <TextInput
                            ref={firstNameRef}
                            clearButtonMode="while-editing"
                            label="First Name"
                            submitBehavior="submit"
                            textContentType="givenName"
                            maxLength={40}
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
                            maxLength={40}
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
                        maxLength={60}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onSubmitEditing={handleRegister}
                    />
                    <Button
                        label="Register"
                        variant="primary"
                        onPress={handleRegister}
                        containerStyle={styles.confirmButton}
                        disabled={!formValid}
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
                </FormContainer>
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
