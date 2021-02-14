export const CREATE_BILL = "CREATE_BILL";
export const SET_BILLS = 'SET_BILLS';

import { insertBill, fetchBills } from '../../helpers/db';

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