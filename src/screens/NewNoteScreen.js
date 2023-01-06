import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    ScrollView,
    Share,
} from "react-native";
import BlueButton from "../components/buttons/BlueButton";
import GoBackButton from "../components/buttons/GoBackButton";
import * as SQLite from "expo-sqlite";
import { useIsFocused } from "@react-navigation/native";
import HorseCheckbox from "../components/buttons/HorseCheckbox";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";
const db = SQLite.openDatabase("thomas-horse-notes.db");

const NewNoteScreen = ({ navigation, route }) => {
    const noteDate = route.params.noteDate;
    const [horses, setHorses] = useState([]);
    const [checkedHorses, setCheckedHorses] = useState([]);
    const [note, setNote] = useState("");
    const isFocused = useIsFocused();

    const handleToggleCheckedHorse = (id, name) => {
        // if object found then delete
        if (checkedHorses.find((obj) => obj.id === id)) {
            setCheckedHorses(checkedHorses.filter((item) => item.id !== id));
        } else {
            // else add
            setCheckedHorses([...checkedHorses, { id: id, name: name }]);
        }
    };

    const handleSaveNote = () => {
        if (note.length < 1) {
            return;
        }

        checkedHorses.map((horse) => {
            // check this horse already has a note record and update
            // if not then insert
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM note WHERE horse_id=? AND date=? LIMIT 1",
                    [horse.id, noteDate],
                    (txObj, resultSet) => {
                        // if record exists the update, else insert
                        if (resultSet.rows.length > 0) {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    "UPDATE note SET note = note || ? WHERE horse_id=? AND date=?;",
                                    ["\n" + note, horse.id, noteDate],
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
                                    [horse.id, noteDate, note],
                                    (txObj, resultSet) => {
                                        console.log("Successful note insert.");
                                    },
                                    (txObj, error) => {
                                        console.log("Failed to insert note: ");
                                    }
                                );
                            });
                        }
                    },
                    (txObj, error) => console.log("Failed query ", error)
                );
            });
        });

        navigation.goBack();
    };

    const handleShareNote = async () => {
        if (note.length < 1) {
            return;
        }

        // CUNSTRUCT NOTE
        let formattedNote = "";

        // add date
        formattedNote = "📅 " + noteDate + "\n";

        // add horses
        let horseNames = checkedHorses.map((horse) => horse.name);
        horseNames = horseNames.join(" • ");
        formattedNote = formattedNote + "🐴 " + horseNames + "\n";

        // add note
        formattedNote = formattedNote + "📝 " + note;

        // SHARE NOTE
        try {
            const result = await Share.share({
                message: formattedNote,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {}
    };

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
            <ScrollView style={{ flex: 1 }}>
                <ScrollView
                    style={styles.horseCheckboxesContainer}
                    contentContainerStyle={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        paddingTop: 36,
                        width: "300%",
                        paddingBottom: 26,
                        paddingHorizontal: 12,
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {horses.map(({ id, name }) => (
                        <View style={{ marginRight: 10, marginBottom: 10 }}>
                            <HorseCheckbox
                                text={name}
                                onPress={() => {
                                    handleToggleCheckedHorse(id, name);
                                }}
                            />
                        </View>
                    ))}
                </ScrollView>
                <ScrollView
                    style={styles.editNoteForm}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <TextInput
                        style={styles.noteInput}
                        multiline={true}
                        autoComplete="off"
                        maxHeight={200}
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
            </ScrollView>
            <View style={styles.footer}>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <BlueButton
                        onPress={handleSaveNote}
                        buttonText="Αποθήκευση"
                    />
                </View>
                <View
                    style={{
                        marginLeft: 18,
                        flex: 1,
                    }}
                >
                    <BlueButton
                        onPress={handleShareNote}
                        buttonText="Αποστολή"
                    />
                </View>
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
    horseCheckboxesContainer: {
        flexGrow: 0,
    },
    editNoteForm: {
        flex: 1,
        width: "100%",
        padding: 12,
        paddingTop: 0,
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: 18,
        borderTopWidth: 1,
        borderTopColor: DIVIDER_COLOR,
    },
    noteInput: {
        width: "100%",
        maxWidth: "100%",
        borderWidth: 1,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        fontSize: 16,
        color: "#fff",
        borderColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
});

export default NewNoteScreen;
