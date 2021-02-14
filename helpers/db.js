import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('places.db');

export const drop = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DROP TABLE bills',
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
    return promise;
}

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, dateCreated TEXT NOT NULL, dateExpiry TEXT NOT NULL, billAmount TEXT NOT NULL, IBANo TEXT NOT NULL, reference TEXT NOT NULL, status INTEGER NOT NULL);',
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
    return promise;
}

export const insertBill = (title, dateCreated, dateExpiry, billAmount, IBANo, reference, status) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO bills (title, dateCreated, dateExpiry, billAmount, IBANo, reference, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, dateCreated, dateExpiry, billAmount, IBANo, reference, status],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
    return promise;    
}

export const fetchBills = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM bills',
                [],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
    return promise;    
}