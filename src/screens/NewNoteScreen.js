import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    ScrollView,
    FlatList,
} from "react-native";
import BlueButton from "../components/buttons/BlueButton";
import GoBackButton from "../components/buttons/GoBackButton";
import * as SQLite from "expo-sqlite";
import { useIsFocused } from "@react-navigation/native";
import HorseCheckbox from "../components/buttons/HorseCheckbox";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";

const NewNoteScreen = ({ navigation }) => {
    const [horses, setHorses] = useState([]);
    const [checkedHorses, setCheckedHorses] = useState([]);
    const [note, setNote] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const db = SQLite.openDatabase("thomas-horse-notes.db");
            // get horses
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM horse",
                    null,
                    (txObj, resultSet) => {
                        setHorses(resultSet.rows._array);
                        console.log("Successful query: SELECT * FROM horse");
                    },
                    (txObj, error) => console.log("Failed query ", error)
                );
            });
        }
    }, [isFocused]);

    const handleSaveAndSendNote = () => {
        // save after the message was sent

        // go back to horses page
        navigation.pop(2);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={APP_BACKGROUND_COLOR} />
            <View style={styles.header}>
                <GoBackButton
                    onPress={() => navigation.pop(2)}
                    buttonText="Ακύρωση"
                />
                <Text style={styles.headerTitle}>Νέα Σημείωση</Text>
            </View>
            <HorseCheckbox text={"test horse"} />
            <ScrollView
                style={styles.editNoteForm}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flex: 1 }}
            >
                <TextInput
                    style={styles.noteInput}
                    multiline={true}
                    autoComplete="off"
                    autoCorrect={false}
                    autoFocus={false}
                    placeholder="Πληκτρολογήστε μια σημείωση"
                    selectionColor="#06f"
                    placeholderTextColor="#464646"
                    maxLength={1000}
                    value={note}
                    onChangeText={setNote}
                />
            </ScrollView>
            <View style={styles.footer}>
                <BlueButton
                    onPress={handleSaveAndSendNote}
                    buttonText="Αποστολή και Αποθήκευση"
                />
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
    horseCheckboxesList: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#ffffff",
    },
    editNoteForm: {
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
    noteInput: {
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
});

export default NewNoteScreen;
