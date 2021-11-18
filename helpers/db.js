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
                'CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, receiver TEXT NOT NULL, dateCreated TEXT NOT NULL, dateExpiry TEXT NOT NULL, billAmount TEXT NOT NULL, IBANo TEXT NOT NULL, reference TEXT NOT NULL, status INTEGER NOT NULL);',
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

export const insertBill = (title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, status) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO bills (title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, status],
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

export const db_updateBill = ( title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, status, billId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE bills SET title = ?, receiver = ?, dateCreated = ?, dateExpiry = ?, billAmount = ?, IBANo = ?, reference = ?, status = ? WHERE id = ?' 
                ,
                [title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference, status, billId],
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

export const db_updatePaymentStatus = (billId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE bills SET status = 1  WHERE id = ?' 
                ,
                [billId],
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

export const deleteBill = (id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM bills WHERE id = ?',
                [id],
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