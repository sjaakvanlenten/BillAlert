export const CREATE_BILL = "CREATE_BILL";
export const UPDATE_BILL = "UPDATE_BILL";
export const SET_BILLS = 'SET_BILLS';
export const REMOVE_BILL = 'REMOVE_BILL'
export const FILTER_BILLS = 'FILTER_BILLS'

import { insertBill, fetchBills, deleteBill, db_updateBill } from '../../helpers/db';

export const createBill = (title, billAmount, IBANo, reference, dateExpiry) => {
    return async dispatch => {
        try {
            const dbResult = await insertBill(
                title,
                '12 dec', 
                dateExpiry, 
                billAmount, 
                IBANo, 
                reference, 
                0,
            );
            console.log(dbResult);
            dispatch({ type: CREATE_BILL, billData: {id: dbResult.insertId.toString(), title, billAmount, IBANo, reference, dateExpiry}})
            }
        catch (err) {
            console.log(err);
            throw err;
        }
    }   
}

export const updateBill = (billId, title, billAmount, IBANo, reference, dateExpiry) => {
    return async dispatch => {
        try {
            const dbResult = await db_updateBill(
                title,
                '12 dec', 
                dateExpiry, 
                billAmount, 
                IBANo, 
                reference, 
                0,
                billId,
            );
            console.log(dbResult);
            dispatch({ type: UPDATE_BILL, billData: {billId, title, billAmount, IBANo, reference, dateExpiry}})
            }
        catch (err) {
            console.log(err);
            throw err;
        }
    }   
};

export const loadBills = () => {
    return async dispatch => {
        try {
            const dbResult = await fetchBills();
            console.log(dbResult);
            dispatch({ type: SET_BILLS, bills: dbResult.rows._array });
        } catch (err) {
            throw err;
        }
    };
};

export const removeBill = billId => {
    return async dispatch => {
        try {
            const dbResult = await deleteBill(billId);
            dispatch({ type: REMOVE_BILL, billId: billId });
        } catch (err) {
            throw err;
        }
    };
};