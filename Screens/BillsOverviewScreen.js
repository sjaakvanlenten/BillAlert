import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import BillsList from '../components/BillsList';
import HeaderButton from '../components/UI/HeaderButton';
import * as billsActions from '../store/actions/bills';

const BillsOverviewScreen = props => {
    const availableBills = useSelector(state => state.bills.bills);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(billsActions.loadBills());
    }, [dispatch]);

    const displayedBills = availableBills.filter(
        bill => bill.status == 0
    );

    return (
         <BillsList 
            listData={displayedBills} 
            navigation={props.navigation} 
        />
    );
}

export const screenOptions = () => {
    return {
        headerTitle: 'Open Rekeningen',
        headerRight: () => (               
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName={Platform.OS === 'android' ? 'filter-list' : 'filter-list'}
                    onPress={() => {}}
                />
            </HeaderButtons>
        )
    };
};




export default BillsOverviewScreen;