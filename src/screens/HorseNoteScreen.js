import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    ScrollView,
} from "react-native";
import BlueButton from "../components/buttons/BlueButton";
import GoBackButton from "../components/buttons/GoBackButton";
import * as SQLite from "expo-sqlite";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";
const db = SQLite.openDatabase("thomas-horse-notes.db");

const HorseNoteScreen = ({ navigation, route }) => {
    const horseId = route.params.horseId;
    const noteDate = route.params.noteDate;
    const [note, setNote] = useState("");
    const [recordExists, setRecordExists] = useState(false);

    useEffect(() => {
        // get horse note
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM note WHERE horse_id=? AND date=? LIMIT 1",
                [horseId, noteDate],
                (txObj, resultSet) => {
                    // if not empty, set the note
                    if (resultSet.rows.length > 0) {
                        setRecordExists(true);
                        setNote(resultSet.rows._array[0].note);
                        console.log(
                            "Successful query: SELECT * FROM note WHERE horse_id=? AND date=?"
                        );
                    } else {
                        console.log(
                            "No records found using query: SELECT * FROM note WHERE horse_id=? AND date=?"
                        );
                    }
                },
                (txObj, error) => console.log("Failed query ", error)
            );
        });
    }, [db]);

    // get hore note for this day
    // setNote

    const handleSaveNote = () => {
        // if record exists the update, else insert
        if (recordExists) {
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE note SET note=? WHERE horse_id=? AND date=?;",
                    [note, horseId, noteDate],
                    (txObj, resultSet) => {
                        console.log("Successful note update.");
                    },
                    (txObj, error) => {
                        console.log("Failed to update note: ");
                    }
                );
            });
        } else {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO note (horse_id, date, note) VALUES (?, ?, ?);",
                    [horseId, noteDate, note],
                    (txObj, resultSet) => {
                        console.log("Successful note insert.");
                    },
                    (txObj, error) => {
                        console.log("Failed to insert note: ");
                    }
                );
            });
        }
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={APP_BACKGROUND_COLOR} />
            <View style={styles.header}>
                <GoBackButton
                    onPress={navigation.goBack}
                    buttonText="Ακύρωση"
                />
                <Text style={styles.headerTitle}>Σημείωση</Text>
            </View>
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
                <BlueButton onPress={handleSaveNote} buttonText="Αποθήκευση" />
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

export default HorseNoteScreen;
