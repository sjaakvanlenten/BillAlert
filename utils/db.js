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

export const db_init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, receiver TEXT NOT NULL, dateCreated TEXT NOT NULL, dateExpiry TEXT NOT NULL, billAmount TEXT NOT NULL, IBANo TEXT NOT NULL, reference TEXT NOT NULL, paymentDate TEXT, deletionDate TEXT);',
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

export const insertBill = (title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO bills (title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, receiver, dateCreated, dateExpiry, billAmount, IBANo, reference],
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

export const db_updateBill = ( title, receiver, dateExpiry, billAmount, IBANo, reference, billId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE bills SET title = ?, receiver = ?, dateExpiry = ?, billAmount = ?, IBANo = ?, reference = ? WHERE id = ?' 
                ,
                [title, receiver, dateExpiry, billAmount, IBANo, reference, billId],
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

export const db_updatePaymentDate = (datePayed, billId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE bills SET paymentDate = ?  WHERE id = ?' 
                ,
                [datePayed, billId],
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

export const deleteBill = (deletionDate, id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE bills SET deletionDate = ?  WHERE id = ?' 
                ,
                [deletionDate, id],
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

export const deleteBillPermanent = (id) => {
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