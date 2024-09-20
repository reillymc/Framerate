import { useSession } from "@/modules/auth";
import { Button, Form, TextInput } from "@reillymc/react-native-components";
import { useRouter } from "expo-router";
import { type FC, useCallback, useRef, useState } from "react";
import { StyleSheet, type TextInput as rnTextInput } from "react-native";

const LoginScreen: FC = () => {
    const router = useRouter();
    const { signIn } = useSession();

    const passwordRef = useRef<rnTextInput>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = useCallback(() => {
        if (!(email && password)) return;

        signIn({ email, password });
        router.replace("/(tabs)/movies");
    }, [router, email, password, signIn]);

    return (
        <Form style={styles.form}>
            <TextInput
                label="Email"
                placeholder="Email..."
                width="large"
                textContentType="username"
                autoCapitalize="none"
                value={email}
                clearButtonMode="while-editing"
                mandatory
                containerStyle={styles.inputItem}
                onChangeText={setEmail}
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
            />
            <TextInput
                ref={passwordRef}
                label="Password"
                placeholder="Password..."
                width="large"
                textContentType="password"
                secureTextEntry={true}
                value={password}
                clearButtonMode="while-editing"
                mandatory
                containerStyle={styles.inputItem}
                onChangeText={setPassword}
                onSubmitEditing={handleLogin}
            />
            <Button
                label="Login"
                onPress={handleLogin}
                style={styles.confirmButton}
                size="regular"
                disabled={!(email && password)}
            />
        </Form>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 80,
        marginLeft: 16,
    },
    title: {
        fontSize: 40,
        lineHeight: 48,
    },
    form: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 80,
    },
    inputItem: {
        marginBottom: 20,
    },
    confirmButton: {
        marginTop: 16,
    },
    switchButton: {
        position: "absolute",
        bottom: 48,
    },
});
