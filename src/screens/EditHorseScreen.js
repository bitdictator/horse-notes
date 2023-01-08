import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    ScrollView,
    Image,
} from "react-native";
import BlueButton from "../components/buttons/BlueButton";
import GoBackButton from "../components/buttons/GoBackButton";
import TextButton from "../components/buttons/TextButton";
import * as SQLite from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";
const db = SQLite.openDatabase("thomas-horse-notes.db");

const EditHorseScreen = ({ navigation, route }) => {
    const [horseName, setHorseName] = useState(route.params.horseName);
    const horseId = route.params.horseId;
    const [image, setImage] = useState(route.params.horseImage);

    const handleSelectImageFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            allowsMultipleSelection: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    const handleSelectImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            allowsMultipleSelection: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        // validate horse name, must be less than 18 characters and more than 0
        if (horseName.length < 1 || horseName.length > 18) {
            return;
        }

        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE horse SET name=?, image=? WHERE id=?;",
                [horseName, image, horseId],
                (txObj, resultSet) => {
                    console.log("Successful horse update.");
                },
                (txObj, error) => {
                    console.log("Failed to update horse: ");
                }
            );
        });

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={APP_BACKGROUND_COLOR} />
            <View style={styles.header}>
                <GoBackButton onPress={navigation.goBack} />
                <Text style={styles.headerTitle}>Επεξεργασία αλόγου</Text>
            </View>
            <ScrollView
                style={styles.addHorseForm}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={{ fontSize: 18, color: "#fff", marginBottom: 4 }}>
                    Φωτογραφία
                </Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 10,
                    }}
                >
                    <View style={styles.horseImageWrapper}>
                        {image ? (
                            <Image
                                style={styles.horseImage}
                                source={{ uri: image }}
                            />
                        ) : (
                            <Image
                                style={styles.horseImage}
                                source={{ uri: image }}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            justifyContent: "space-evenly",
                            alignItems: "flex-start",
                        }}
                    >
                        <TextButton
                            buttonText="Προσθήκη απο κάμερα"
                            onPress={handleSelectImageFromCamera}
                        />
                        <TextButton
                            buttonText="Προσθήκη απο συλλογή"
                            onPress={handleSelectImageFromGallery}
                        />
                    </View>
                </View>
                <TextInput
                    style={styles.textInput}
                    value={horseName}
                    autoComplete="off"
                    autoCorrect={false}
                    autoFocus={false}
                    selectionColor="#06f"
                    placeholder="Όνομα"
                    placeholderTextColor="#464646"
                    onChangeText={setHorseName}
                />
            </ScrollView>
            <View style={styles.footer}>
                <BlueButton onPress={handleSave} buttonText="Αποθήκευση" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_BACKGROUND_COLOR,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        height: 60,
        padding: 12,
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderBottomColor: DIVIDER_COLOR,
    },
    headerTitle: {
        zIndex: -1,
        position: "absolute",
        textAlign: "center",
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        left: 0,
        right: 0,
    },
    addHorseForm: {
        flex: 1,
        width: "100%",
        paddingTop: 36,
        padding: 18,
    },
    footer: {
        width: "100%",
        padding: 18,
        borderTopWidth: 1,
        borderTopColor: DIVIDER_COLOR,
    },
    textInput: {
        width: "100%",
        borderWidth: 1,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        fontSize: 18,
        color: "#fff",
        borderColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    horseImageWrapper: {
        height: 100,
        width: 100,
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 12,
        alignItems: "center",
        padding: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    horseImage: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        borderRadius: 8,
    },
});
export default EditHorseScreen;
