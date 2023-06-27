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
import { initDB } from "./src/database/database";

const Stack = createNativeStackNavigator();

export default function App() {
    // Initialize the database
    initDB();

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
