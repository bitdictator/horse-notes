import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("horse-notes-app.db");

export const initDB = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS horse (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, image TEXT NOT NULL)",
            [],
            (txObj, resulSet) => console.log("Created 'horse' table."),
            (txObj, error) =>
                console.log("Failed to create 'horse' table: ", error)
        );

        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS note (id INTEGER PRIMARY KEY AUTOINCREMENT, horse_id INTEGER, date TEXT NOT NULL, note TEXT NOT NULL, FOREIGN KEY(horse_id) REFERENCES horse(id))",
            [],
            (txObj, resulSet) => console.log("Created 'note' table."),
            (txObj, error) =>
                console.log("Failed to create 'note' table: ", error)
        );
    });
};
