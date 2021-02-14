import { CREATE_BILL, SET_BILLS } from '../actions/bills';
import Bill from '../../models/bill';

const initialState = {
    bills: [],
    filteredBills: [],
};

const billsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BILLS:
            return {
                bills: action.bills
            }
        case CREATE_BILL:
            const newBill = new Bill(
                action.billData.id, 
                action.billData.title, 
                '10 jan', 
                action.billData.dateExpiry, 
                action.billData.billAmount,
                action.billData.IBANo, 
                action.billData.reference, 
                0, 
            );
            return {
                ...state,
                bills: state.bills.concat(newBill),
            } ;
            default:
            return state;
    }

}

export default billsReducer;