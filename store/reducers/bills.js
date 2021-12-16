import { 
    CREATE_BILL, 
    UPDATE_BILL, 
    REMOVE_BILL,
    REMOVE_BILL_PERMANENT, 
    SET_BILLS, 
    UPDATE_PAYMENT_DATE, 
} from '../actions/bills';

import Bill from '../../models/bill';

const initialState = {
    bills: [],
};

let billIndex = null;

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
                action.billData.receiver,  
                action.billData.dateCreated, 
                action.billData.dateExpiry, 
                action.billData.billAmount,
                action.billData.IBANo, 
                action.billData.reference, 
                null,
                null,
            );
            return {
                ...state,
                bills: state.bills.concat(newBill),
            }
        case UPDATE_BILL:
            billIndex = state.bills.findIndex(
                bill => bill.id === action.billData.billId
              );
              const updatedBill = new Bill(
                action.billData.billId, 
                action.billData.title, 
                action.billData.receiver,
                action.billData.dateCreated, 
                action.billData.dateExpiry, 
                action.billData.billAmount,
                action.billData.IBANo, 
                action.billData.reference, 
                state.bills[billIndex].paymentDate,
                null,
            );
            const updatedBills = [...state.bills];
            updatedBills[billIndex] = updatedBill;
              
            return {
                ...state,
                bills: updatedBills
              };
        case UPDATE_PAYMENT_DATE:
            billIndex = state.bills.findIndex(
                bill => bill.id === action.billData.billId
            );
            let BillsCopy = [...state.bills];
            BillsCopy[billIndex]['paymentDate'] = action.billData.datePayed;
            return {
                ...state,
                bills: BillsCopy
            }
        case REMOVE_BILL:
            billIndex = state.bills.findIndex(
                bill => bill.id === action.billData.billId
            );
            const deletedBill = [...state.bills];
            deletedBill[billIndex]['deletionDate'] = action.billData.deletionDate;
            return {
                ...state,
                bills: deletedBill
            }
        case REMOVE_BILL_PERMANENT:
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