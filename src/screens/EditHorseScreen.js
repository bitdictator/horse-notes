import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    ScrollView,
    Image,
    Modal,
    KeyboardAvoidingView,
} from "react-native";
import BlueButton from "../components/buttons/BlueButton";
import GoBackButton from "../components/buttons/GoBackButton";
import TextButton from "../components/buttons/TextButton";
import * as SQLite from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import { db } from "../database/database.js";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";

const EditHorseScreen = ({ navigation, route }) => {
    const [horseName, setHorseName] = useState(route.params.horseName);
    const horseId = route.params.horseId;
    const [image, setImage] = useState(route.params.horseImage);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [horseNameVerify, setHorseNameVerify] = useState("");

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
            console.log(result.assets[0].uri);
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
                [horseName.trim(), image, horseId],
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

    const handleDelete = () => {
        // first check if name typed correctly
        if (horseNameVerify !== horseName) {
            return;
        }

        db.transaction((tx) => {
            // delete notes
            tx.executeSql(
                "DELETE FROM note WHERE horse_id=?;",
                [horseId],
                (txObj, resultSet) => {
                    console.log(
                        "Successfully deleted notes of horse with id: ",
                        horseId
                    );
                },
                (txObj, error) => {
                    console.log(
                        "Failed to delete notes of horse with id: ",
                        horseId
                    );
                }
            );
            // delete horses
            tx.executeSql(
                "DELETE FROM horse WHERE id=?;",
                [horseId],
                (txObj, resultSet) => {
                    console.log(
                        "Successfully deleted horse with id: ",
                        horseId
                    );
                },
                (txObj, error) => {
                    console.log("Failed to delete horse with id: ", horseId);
                }
            );
        });

        navigation.popToTop();
    };

    const toggleDeleteHorseModal = () => {
        setDeleteModalVisible(!deleteModalVisible);

        // if togglede to false, clean the horse name verify
        if (!deleteModalVisible) {
            setHorseNameVerify("");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={APP_BACKGROUND_COLOR} />
            <View style={styles.header}>
                <GoBackButton onPress={navigation.goBack} />
                <Text style={styles.headerTitle}>Επεξεργασία αλόγου</Text>
                <TextButton
                    buttonText={"Διαγ."}
                    color={"#da3633"}
                    onPress={toggleDeleteHorseModal}
                />
            </View>
            <ScrollView
                style={styles.addHorseForm}
                keyboardShouldPersistTaps="handled"
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: "#464646",
                        marginBottom: 4,
                    }}
                >
                    Προσθηκη φωτογραφίας
                </Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 10,
                    }}
                >
                    <View style={styles.horseImageWrapper}>
                        {image !== "" ? (
                            <Image
                                style={styles.horseImage}
                                source={{ uri: image }}
                            />
                        ) : (
                            <Image
                                style={styles.horseImage}
                                source={require("../../assets/horse-image.png")}
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
                            color={"#39d353"}
                        />
                        <TextButton
                            buttonText="Προσθήκη απο συλλογή"
                            onPress={handleSelectImageFromGallery}
                            color={"#39d353"}
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
            <Modal
                animationType="none"
                onDismiss={toggleDeleteHorseModal}
                onRequestClose={toggleDeleteHorseModal}
                statusBarTranslucent={true}
                transparent={true}
                visible={deleteModalVisible}
            >
                <KeyboardAvoidingView
                    behavior="height"
                    style={{
                        flex: 1,
                        width: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "flex-end",
                    }}
                >
                    <View style={styles.deleteHorseModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Διαγραφή αλόγου
                            </Text>
                            <TextButton
                                buttonText="Ακύρωση"
                                color="#06f"
                                onPress={toggleDeleteHorseModal}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                color: "#464646",
                                marginBottom: 4,
                            }}
                        >
                            Πληκτρολογήστε το όνομα του αλόγου για να το
                            διαγράψετε
                        </Text>
                        <View style={styles.modalContent}>
                            <TextInput
                                style={[styles.textInput, { marginBottom: 20 }]}
                                value={horseNameVerify}
                                autoComplete="off"
                                autoCorrect={false}
                                autoFocus={false}
                                selectionColor="#06f"
                                placeholder="Όνομα"
                                placeholderTextColor="#464646"
                                onChangeText={setHorseNameVerify}
                            />
                            <BlueButton
                                onPress={handleDelete}
                                buttonText="Διαγραφή"
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        justifyContent: "space-between",
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
    deleteHorseModal: {
        width: "100%",
        padding: 18,
        backgroundColor: APP_BACKGROUND_COLOR,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    modalHeader: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    modalContent: {},
});
export default EditHorseScreen;
