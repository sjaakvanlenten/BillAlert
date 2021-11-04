export const CREATE_BILL = "CREATE_BILL";
export const UPDATE_BILL = "UPDATE_BILL";
export const SET_BILLS = 'SET_BILLS';
export const REMOVE_BILL = 'REMOVE_BILL'

import moment from 'moment';

import { insertBill, fetchBills, deleteBill, db_updateBill } from '../../helpers/db';

export const createBill = (title, billAmount, IBANo, reference, dateExpiry) => {
    dateCreated = moment().format('LL')
    return async dispatch => {
        try {
            const dbResult = await insertBill(
                title,
                dateCreated,
                dateExpiry, 
                billAmount, 
                IBANo, 
                reference, 
                0,
            );
            dispatch({ type: CREATE_BILL, billData: {id: dbResult.insertId.toString(), title, dateCreated, billAmount, IBANo, reference, dateExpiry}})
            }
        catch (err) {
            console.log(err);
            throw err;
        }
    }   
}

export const updateBill = (billId, title, billAmount, IBANo, reference, dateExpiry) => {
    dateCreated = moment().format('LL')
    return async dispatch => {
        try {
            const dbResult = await db_updateBill(
                title,
                dateCreated, 
                dateExpiry, 
                billAmount, 
                IBANo, 
                reference, 
                0,
                billId,
            );
            dispatch({ type: UPDATE_BILL, billData: {billId, title, dateCreated, billAmount, IBANo, reference, dateExpiry}})
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