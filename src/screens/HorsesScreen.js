import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import TextButton from "../components/buttons/TextButton";
import * as SQLite from "expo-sqlite";
import HorseCard from "../components/cards/HorseCard";
import BlueButton from "../components/buttons/BlueButton";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";

const HorsesScreen = ({ navigation }) => {
    const [horses, setHorses] = useState([]);
    const isFocused = useIsFocused();

    const renderHorseCard = ({ item }) => (
        <HorseCard
            horseName={item.name}
            onPress={() => {
                navigation.navigate("HorseCalendar", {
                    horseId: item.id,
                    horseImage: item.image,
                });
            }}
            imageSource={item.image}
        />
    );

    useEffect(() => {
        if (isFocused) {
            const db = SQLite.openDatabase("horse-notes-app.db");
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
                <Text style={styles.headerTitle}>Τα άλογα σας</Text>
                <TextButton
                    buttonText="Προσθήκη"
                    onPress={() => navigation.navigate("AddHorse")}
                    color={"#06f"}
                />
            </View>
            <FlatList
                data={horses}
                renderItem={renderHorseCard}
                keyExtractor={(item) => item.id}
                style={styles.horsesList}
                contentContainerStyle={{ paddingVertical: 36 }}
                ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
            ></FlatList>
            <View style={styles.footer}>
                <BlueButton
                    onPress={() => navigation.navigate("NewNoteCalendar")}
                    buttonText="Νέα Σημείωση"
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
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        padding: 12,
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderBottomColor: DIVIDER_COLOR,
    },
    headerTitle: {
        textAlign: "center",
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
    },
    horsesList: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 12,
    },
    footer: {
        width: "100%",
        padding: 18,
        borderTopWidth: 1,
        borderTopColor: DIVIDER_COLOR,
    },
});

export default HorsesScreen;
