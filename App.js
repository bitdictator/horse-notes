import { StyleSheet } from "react-native";
import HorsesScreen from "./src/screens/HorsesScreen";
import AddHorseScreen from "./src/screens/AddHorseScreen";
import HorseCalendarScreen from "./src/screens/HorseCalendarScreen";
import HorseNoteScreen from "./src/screens/HorseNoteScreen";
import NewNoteCalendarScreen from "./src/screens/NewNoteCalendarScreen";
import NewNoteScreen from "./src/screens/NewNoteScreen";
import EditHorseScreen from "./src/screens/EditHorseScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SQLite from "expo-sqlite";

const Stack = createNativeStackNavigator();

export default function App() {
    const db = SQLite.openDatabase("thomas-horse-notes.db");

    // init tables
    db.transaction((tx) => {
        // init horse table
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS horse (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, image TEXT NOT NULL)",
            [],
            (txObj, resulSet) => console.log("Created 'horse' table."),
            (txObj, error) =>
                console.log("Failed to create 'horse' table: ", error)
        );

        // init note table
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS note (id INTEGER PRIMARY KEY AUTOINCREMENT, horse_id INTEGER, date TEXT NOT NULL, note TEXT NOT NULL, FOREIGN KEY(horse_id) REFERENCES horse(id))",
            [],
            (txObj, resulSet) => console.log("Created 'note' table."),
            (txObj, error) =>
                console.log("Failed to create 'note' table: ", error)
        );
    });

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Horses"
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            >
                <Stack.Screen name="Horses" component={HorsesScreen} />
                <Stack.Screen name="AddHorse" component={AddHorseScreen} />
                <Stack.Screen name="EditHorse" component={EditHorseScreen} />
                <Stack.Screen
                    name="HorseCalendar"
                    component={HorseCalendarScreen}
                />
                <Stack.Screen name="HorseNote" component={HorseNoteScreen} />
                <Stack.Screen
                    name="NewNoteCalendar"
                    component={NewNoteCalendarScreen}
                />
                <Stack.Screen name="NewNote" component={NewNoteScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({});
