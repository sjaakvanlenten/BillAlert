export const CREATE_BILL = "CREATE_BILL";
export const UPDATE_BILL = "UPDATE_BILL";
export const SET_BILLS = 'SET_BILLS';
export const REMOVE_BILL_PERMANENT = 'REMOVE_BILL_PERMANENT';
export const REMOVE_BILL = 'REMOVE_BILL';
export const UPDATE_PAYMENT_DATE = 'UPDATE_PAYMENT_DATE';

import moment from 'moment';

import { 
    insertBill, 
    fetchBills, 
    deleteBill, 
    deleteBillPermanent, 
    db_updateBill, 
    db_updatePaymentDate 
} from '../../helpers/db';

export const createBill = (title, receiver, billAmount, IBANo, reference, dateExpiry) => {
    dateCreated = moment().format()
    return async dispatch => {
        try {
            const dbResult = await insertBill(
                title,
                receiver,
                dateCreated,
                dateExpiry, 
                billAmount, 
                IBANo, 
                reference, 
            );
            dispatch({ type: CREATE_BILL, billData: {id: dbResult.insertId.toString(), title, receiver, dateCreated, billAmount, IBANo, reference, dateExpiry}})
            }
        catch (err) {
            throw err;
        }
    }   
}

export const updateBill = (billId, title, receiver, billAmount, IBANo, reference, dateExpiry) => {
    dateCreated = moment().format()
    return async dispatch => {
        try {
            const dbResult = await db_updateBill(
                title,
                receiver,
                dateCreated, 
                dateExpiry, 
                billAmount, 
                IBANo, 
                reference, 
                billId,
            );
            dispatch({ type: UPDATE_BILL, billData: {billId, title, receiver, dateCreated, billAmount, IBANo, reference, dateExpiry}})
            }
        catch (err) {
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

export const updatePaymentDate = billId => {
    const datePayed = moment().format()
    return async dispatch => {
        try {
            const dbResult = await db_updatePaymentDate(datePayed, billId);
            dispatch({ type: UPDATE_PAYMENT_DATE, billData:{ billId, datePayed }});
        } catch (err) {
            throw err;
        }
    };
};

export const removeBill = (billId, revertBill=false) => {
    const deletionDate = !revertBill ? moment().format() : null;
    return async dispatch => {
        try {    
            const dbResult = await deleteBill(deletionDate, billId);
            dispatch({ type: REMOVE_BILL, billData:{ billId, deletionDate }});
        } catch (err) {
            throw err;
        }
    };
};

export const removeBillPermanent = billId => {
    return async dispatch => {
        try {
            const dbResult = await deleteBillPermanent(billId);
            dispatch({ type: REMOVE_BILL_PERMANENT, billId: billId });
        } catch (err) {
            throw err;
        }
    };
};