import {
    Accordion,
    HeaderCloseAction,
    ScreenLayout,
    SegmentedControl,
} from "@/components";
import { useHealth } from "@/hooks";
import { useSession } from "@/modules/auth";
import {
    useCompany,
    useDeleteCompany,
    useSaveCompany,
} from "@/modules/company";
import {
    useCurrentUserConfig,
    useDeleteUser,
    useSaveUser,
    useUser,
} from "@/modules/user";
import { MergeConfiguration } from "@/modules/user";
import {
    Button,
    IconActionV2,
    SwipeAction,
    SwipeView,
    Text,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { type FC, useCallback, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    type TextInput as rnTextInput,
} from "react-native";

import { version } from "@/package.json";

const Profile: FC = () => {
    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const { signOut } = useSession();

    const queryClient = useQueryClient();

    const { userId } = useSession();
    const { data: serverVersion } = useHealth();

    const { data: user } = useUser(userId);
    const { configuration } = useCurrentUserConfig();
    const { mutate: saveUser } = useSaveUser();
    const { mutate: deleteUser } = useDeleteUser();

    const { data: company = [] } = useCompany();
    const { mutate: saveCompany } = useSaveCompany();
    const { mutate: deleteCompany } = useDeleteCompany();

    const [venuesCollapsed, setVenuesCollapsed] = useState(true);
    const [friendsCollapsed, setFriendsCollapsed] = useState(true);
    const [venue, setVenue] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const venueInputRef = useRef<rnTextInput>(null);
    const lastNameRef = useRef<rnTextInput>(null);

    const addVenue = useCallback(() => {
        venueInputRef.current?.blur();

        const newVenue = venue.trim();

        if (!(userId && newVenue)) {
            return;
        }

        const knownVenueNames = [
            ...new Set(
                [...configuration.venues.knownVenueNames, newVenue].sort(),
            ),
        ];

        saveUser({
            userId,
            configuration: MergeConfiguration(configuration, {
                venues: {
                    knownVenueNames,
                },
            }),
        });

        setVenue("");
    }, [saveUser, userId, configuration, venue]);

    const addFriend = useCallback(() => {
        lastNameRef.current?.blur();
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        if (!(trimmedFirstName && trimmedLastName)) {
            return;
        }

        saveCompany({ firstName: trimmedFirstName, lastName: trimmedLastName });

        setFirstName("");
        setLastName("");
    }, [firstName, lastName, saveCompany]);

    const removeVenue = useCallback(
        (venue: string) => {
            if (!(userId && configuration)) return;

            saveUser({
                userId: userId,
                configuration: {
                    ...configuration,
                    venues: {
                        knownVenueNames:
                            configuration.venues.knownVenueNames.filter(
                                (v) => v !== venue,
                            ),
                    },
                },
            });
        },
        [saveUser, userId, configuration],
    );

    const handleDeleteAccount = useCallback(() => {
        if (!userId) return;

        Alert.alert(
            "Confirm Delete Account",
            "This will permanently delete all watch history, reviews and other account data",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    isPreferred: true,
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteUser({ userId });
                        signOut();
                    },
                },
            ],
        );
    }, [userId, signOut, deleteUser]);

    const showAdminButton = user && "isAdmin" in user && user.isAdmin;

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: user
                            ? `${user.firstName} ${user.lastName}`
                            : "...",
                        headerLeft: () => (
                            <HeaderCloseAction
                                label="Done"
                                onClose={router.back}
                            />
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
                {user ? (
                    <>
                        <View style={styles.profileSection}>
                            <Text variant="title">Details</Text>
                            <TextInput
                                label="First Name"
                                value={user.firstName}
                                containerStyle={styles.sectionElement}
                                disabled
                            />
                            <TextInput
                                label="Last Name"
                                value={user.lastName}
                                containerStyle={styles.sectionElement}
                                disabled
                            />
                        </View>

                        <View style={styles.profileSection}>
                            <Text variant="title">Customisation</Text>
                            <SegmentedControl
                                label="Rating System"
                                options={
                                    [
                                        { label: "5 Star", value: 5 },
                                        { label: "10 Star", value: 10 },
                                    ] as const
                                }
                                value={configuration.ratings.starCount}
                                style={styles.sectionElement}
                                onChange={({ value }) =>
                                    saveUser({
                                        userId: user.userId,
                                        configuration: MergeConfiguration(
                                            configuration,
                                            {
                                                ratings: {
                                                    starCount: value,
                                                },
                                            },
                                        ),
                                    })
                                }
                            />
                            <Pressable
                                style={styles.collapsibleHeading}
                                onPress={() =>
                                    setVenuesCollapsed(!venuesCollapsed)
                                }
                            >
                                <Text
                                    variant="label"
                                    style={styles.indentedElement}
                                >
                                    Known Venues
                                </Text>
                                <IconActionV2
                                    iconName={
                                        venuesCollapsed
                                            ? "chevron-down"
                                            : "chevron-up"
                                    }
                                    onPress={() =>
                                        setVenuesCollapsed(!venuesCollapsed)
                                    }
                                />
                            </Pressable>
                            <Accordion
                                collapsed={venuesCollapsed}
                                style={styles.sectionInternalContainer}
                            >
                                {configuration.venues.knownVenueNames.map(
                                    (venue) => (
                                        <SwipeView
                                            key={venue}
                                            rightActions={[
                                                <SwipeAction
                                                    key="delete"
                                                    iconName="delete"
                                                    variant="destructive"
                                                    onPress={() =>
                                                        removeVenue(venue)
                                                    }
                                                />,
                                            ]}
                                        >
                                            <View style={styles.listItem}>
                                                <Text>{venue}</Text>
                                            </View>
                                        </SwipeView>
                                    ),
                                )}
                                <View style={styles.friendInputContainer}>
                                    <TextInput
                                        ref={venueInputRef}
                                        placeholder="Add venue"
                                        maxLength={80}
                                        style={styles.containerisedInput}
                                        value={venue}
                                        onChange={({ nativeEvent }) =>
                                            setVenue(nativeEvent.text)
                                        }
                                        onSubmitEditing={addVenue}
                                    />
                                    <IconActionV2
                                        iconName="check"
                                        onPress={addVenue}
                                        disabled={!venue}
                                    />
                                </View>
                            </Accordion>

                            <View style={styles.sectionElement}>
                                <Pressable
                                    style={styles.collapsibleHeading}
                                    onPress={() =>
                                        setFriendsCollapsed(!friendsCollapsed)
                                    }
                                >
                                    <Text
                                        variant="label"
                                        style={styles.indentedElement}
                                    >
                                        Saved Friends
                                    </Text>
                                    <IconActionV2
                                        iconName={
                                            friendsCollapsed
                                                ? "chevron-down"
                                                : "chevron-up"
                                        }
                                        onPress={() =>
                                            setFriendsCollapsed(
                                                !friendsCollapsed,
                                            )
                                        }
                                    />
                                </Pressable>
                            </View>
                            <Accordion
                                collapsed={friendsCollapsed}
                                style={styles.sectionInternalContainer}
                            >
                                {company.map(
                                    ({ companyId, firstName, lastName }) => (
                                        <SwipeView
                                            key={companyId}
                                            rightActions={[
                                                <SwipeAction
                                                    key="delete"
                                                    iconName="delete"
                                                    variant="destructive"
                                                    onPress={() =>
                                                        deleteCompany({
                                                            companyId,
                                                        })
                                                    }
                                                />,
                                            ]}
                                        >
                                            <View style={styles.listItem}>
                                                <Text>{`${firstName} ${lastName}`}</Text>
                                            </View>
                                        </SwipeView>
                                    ),
                                )}
                                <View style={styles.friendInputContainer}>
                                    <TextInput
                                        placeholder="First name"
                                        returnKeyType="next"
                                        value={firstName}
                                        maxLength={40}
                                        onChangeText={setFirstName}
                                        onSubmitEditing={() =>
                                            lastNameRef.current?.focus()
                                        }
                                        style={styles.containerisedInput}
                                    />
                                    <TextInput
                                        ref={lastNameRef}
                                        placeholder="Last name"
                                        value={lastName}
                                        maxLength={40}
                                        onChange={({ nativeEvent }) =>
                                            setLastName(nativeEvent.text)
                                        }
                                        onSubmitEditing={addFriend}
                                        style={styles.containerisedInput}
                                    />
                                    <IconActionV2
                                        iconName="check"
                                        onPress={addFriend}
                                    />
                                </View>
                            </Accordion>
                        </View>
                    </>
                ) : null}

                <View style={styles.profileSection}>
                    <Text variant="title">Account</Text>
                    <View style={styles.sectionContainer}>
                        <Button
                            label="Change Password"
                            variant="flat"
                            size="small"
                            contentAlign="left"
                            disabled
                            style={styles.actionButton}
                        />
                        <Button
                            label="Log Out"
                            variant="flat"
                            contentAlign="left"
                            size="small"
                            style={styles.actionButton}
                            onPress={() => {
                                router.back();
                                signOut();
                            }}
                        />
                        <Button
                            label="Delete Account"
                            variant="flat"
                            contentAlign="left"
                            size="small"
                            style={styles.actionButton}
                            onPress={handleDeleteAccount}
                        />
                    </View>
                </View>
                <View style={styles.sectionElement}>
                    <Text variant="title">Framerate</Text>
                    <View style={styles.sectionContainer}>
                        {showAdminButton && (
                            <Button
                                label="Administration"
                                variant="flat"
                                size="small"
                                contentAlign="left"
                                style={styles.actionButton}
                                onPress={() => router.push("/administration")}
                            />
                        )}
                        <Button
                            label="Credits"
                            variant="flat"
                            size="small"
                            contentAlign="left"
                            style={styles.actionButton}
                            onPress={() => router.push("/credits")}
                        />
                        <Button
                            label="Clear cache"
                            variant="flat"
                            contentAlign="left"
                            size="small"
                            style={styles.actionButton}
                            onPress={() => queryClient.clear()}
                        />
                        <Text variant="caption" style={styles.actionButton}>
                            Client: {version} / Server: {serverVersion}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

const createStyles = ({ theme: { spacing, color, border } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.pageBottom,
        },
        indentedElement: {
            paddingLeft: spacing.small,
        },
        collapsibleHeading: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: spacing.medium,
        },
        sectionInternalContainer: {
            borderRadius: border.radius.regular,
            overflow: "hidden",
        },
        sectionContainer: {
            marginLeft: spacing.medium,
        },
        profileSection: {
            marginBottom: spacing.large * 2,
        },
        listItem: {
            paddingVertical: spacing.small + spacing.tiny,
            borderBottomWidth: 1,
            borderBottomColor: color.border,
            backgroundColor: color.inputBackground,
            paddingLeft: spacing.small,
        },
        sectionElement: {
            marginTop: spacing.medium,
        },
        containerisedInput: {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: border.radius.loose,
            borderBottomRightRadius: border.radius.loose,
            paddingLeft: spacing.small,
            height: 48,
        },
        friendInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: color.inputBackground,
            paddingRight: spacing.medium,
        },
        actionButton: {
            marginTop: spacing.large,
            marginBottom: spacing.large,
            width: "100%",
        },
        destructiveButton: {
            color: color.destructive,
        },
    });

export default Profile;
