import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import TextButton from "../components/buttons/TextButton";
import GoBackButton from "../components/buttons/GoBackButton";
import { Calendar, LocaleConfig } from "react-native-calendars";
import * as SQLite from "expo-sqlite";
import moment from "moment";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";

LocaleConfig.locales["gr"] = {
    monthNames: [
        "Ιανουάριος",
        "Φεβρουάριος",
        "Μάρτιος",
        "Απρίλιος",
        "Μάιος",
        "Ιούνιος",
        "Ιούλιος",
        "Αύγουστος",
        "Σεπτέμβριος",
        "Οκτώβριος",
        "Νοέμβριος",
        "Δεκέμβριος",
    ],
    monthNamesShort: [
        "Ιαν.",
        "Φεβ.",
        "Μάρ",
        "Απρ",
        "Μάι",
        "Ιούν",
        "Ιούλ",
        "Αύγ",
        "Σεπ",
        "Οκτ",
        "Νοέ",
        "Δεκ,",
    ],
    dayNames: [
        "Κυριακή",
        "Δευτέρα",
        "Τρίτη",
        "Τετάρτη",
        "Πέμπτη",
        "Παρασκευή",
        "Σάββατο",
    ],
    dayNamesShort: ["Κυρ.", "Δευ.", "Τρ.", "Τετ.", "Πέμ.", "Παρ.", "Σάβ."],
    today: "Σήμερα",
};
LocaleConfig.defaultLocale = "gr";

const HorseCalendarScreen = ({ navigation, route }) => {
    const horseId = route.params.horseId;
    const [horseName, setHorseName] = useState("");
    const [currentCalendarDate, setCurrentCalendarDate] = useState(
        moment().format("YYYY-MM-DD")
    );
    const [markedDates, setMarkedDates] = useState({});
    const isFocused = useIsFocused();

    const updateMarkedDates = (currentCalendarDate) => {
        const db = SQLite.openDatabase("thomas-horse-notes.db");
        // get notes for this horse and this month of this year
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM note WHERE horse_id=? AND date LIKE '" +
                    currentCalendarDate.slice(0, -3) +
                    "%' AND note!='';",
                [horseId],
                (txObj, resultSet) => {
                    let markedDatesObj = {};

                    // whatever happens still color the text of the current day
                    if (currentCalendarDate === moment().format("YYYY-MM-DD")) {
                        markedDatesObj[currentCalendarDate] = {
                            customStyles: {
                                text: {
                                    color: "#06f",
                                },
                            },
                        };
                    }

                    for (
                        let index = 0;
                        index < resultSet.rows._array.length;
                        index++
                    ) {
                        const element = resultSet.rows._array[index];
                        markedDatesObj[element.date] = {
                            marked: true,
                            customStyles:
                                element.date === currentCalendarDate
                                    ? {
                                          text: {
                                              color: "#06f",
                                          },
                                      }
                                    : {},
                        };
                    }
                    setMarkedDates(markedDatesObj);
                },
                (txObj, error) => console.log("Failed query ", error)
            );
        });
    };

    const getHorseName = () => {
        const db = SQLite.openDatabase("thomas-horse-notes.db");
        // get horses
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name FROM horse WHERE id=? LIMIT 1",
                [horseId],
                (txObj, resultSet) => {
                    setHorseName(resultSet.rows._array[0].name);
                    console.log(
                        "Successful query: SELECT name FROM horse WHERE id=?"
                    );
                },
                (txObj, error) => console.log("Failed query ", error)
            );
        });
    };

    useEffect(() => {
        if (isFocused) {
            getHorseName();

            updateMarkedDates(currentCalendarDate);
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={APP_BACKGROUND_COLOR} />
            <View style={styles.header}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>{horseName}</Text>
                <TextButton
                    buttonText={"Επεξ..."}
                    onPress={() => {
                        navigation.navigate("EditHorse", {
                            horseId: horseId,
                            horseName: horseName,
                        });
                    }}
                />
            </View>
            <View style={styles.pageContentWrapper}>
                <Calendar
                    // Initially visible month. Default = now
                    //initialDate={"2022-12-15"}
                    current={currentCalendarDate}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    //minDate={"2012-05-10"}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    //maxDate={"2012-05-30"}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {
                        navigation.navigate("HorseNote", {
                            horseId: horseId,
                            noteDate: day.dateString,
                            horseName: horseName,
                        });
                    }}
                    // Handler which gets executed on day long press. Default = undefined
                    // onDayLongPress={(day) => {
                    //     console.log("selected day", day);
                    // }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={"MMMM yyyy"}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => {
                        setCurrentCalendarDate(month.dateString);
                        updateMarkedDates(month.dateString);
                    }}
                    // Hide month navigation arrows. Default = false
                    //hideArrows={true}

                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    //renderArrow={(direction) => <Arrow />}

                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={true}
                    // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                    onPressArrowRight={(addMonth) => addMonth()}
                    // Disable left arrow. Default = false
                    disableArrowLeft={false}
                    // Disable right arrow. Default = false
                    disableArrowRight={false}
                    // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                    disableAllTouchEventsForDisabledDays={true}
                    // Replace default month and year title with custom one. the function receive a date as parameter
                    // renderHeader={(date) => {
                    //     console.log(date);
                    //     /*Return JSX*/
                    //     return <Text>Test</Text>;
                    // }}
                    // Enable the option to swipe between months. Default = false
                    enableSwipeMonths={false}
                    style={{
                        marginHorizontal: 12,
                        marginVertical: 36,
                        borderRadius: 12,
                        padding: 2, // to hide bottom sharp corners bug
                    }}
                    theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#181818",
                        textSectionTitleColor: "#ffffff",
                        textSectionTitleDisabledColor: "#ffffff",
                        selectedDayBackgroundColor: "none",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#06f",
                        dayTextColor: "#ffffff",
                        textDisabledColor: "#d9e1e8",
                        dotColor: "#ffae00",
                        selectedDotColor: "#ffae00",
                        arrowColor: "#06f",
                        disabledArrowColor: "#d9e1e8",
                        monthTextColor: "#fff",
                        indicatorColor: "#fff",
                        textMonthFontWeight: "bold",
                        textMonthFontSize: 16,
                    }}
                    markingType={"custom"}
                    markedDates={markedDates}
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
    pageContentWrapper: {
        flex: 1,
        width: "100%",
    },
});

export default HorseCalendarScreen;
