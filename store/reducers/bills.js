import { CREATE_BILL, UPDATE_BILL, REMOVE_BILL, SET_BILLS } from '../actions/bills';
import Bill from '../../models/bill';

const initialState = {
    bills: [],
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
                action.billData.dateCreated, 
                action.billData.dateExpiry, 
                action.billData.billAmount,
                action.billData.IBANo, 
                action.billData.reference, 
                0, 
            );
            return {
                ...state,
                bills: state.bills.concat(newBill),
            }
        case UPDATE_BILL:
            const billIndex = state.bills.findIndex(
                bill => bill.id === action.billData.billId
              );
              const updatedBill = new Bill(
                action.billData.billId, 
                action.billData.title, 
                '10 jan', 
                action.billData.dateExpiry, 
                action.billData.billAmount,
                action.billData.IBANo, 
                action.billData.reference, 
                0, 
            );
            const updatedBills = [...state.bills];
            updatedBills[billIndex] = updatedBill;
              
            return {
                ...state,
                bills: updatedBills
              };
        case REMOVE_BILL:
            return {
                ...state,
                bills: state.bills.filter(
                    bill => bill.id !== action.billId
                )
            }
        default:
            return state;
    }

}

export default billsReducer;