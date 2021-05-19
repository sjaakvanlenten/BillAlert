import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { HeaderButtons, OverflowMenu, HiddenItem } from 'react-navigation-header-buttons';

import BillsList from '../components/BillsList';
import HeaderButton from '../components/UI/HeaderButton';
import * as billsActions from '../store/actions/bills';

const BillsOverviewScreen = props => {
    const { navigation } = props;
    const availableBills = useSelector(state => state.bills.bills);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(billsActions.loadBills());
    }, [dispatch]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (               
                <HeaderButtons HeaderButtonComponent={HeaderButton}>                      
                    <OverflowMenu
                        style={{ marginHorizontal: 10 }}
                        OverflowIcon={<MaterialIcons name="filter-list" size={23} color="white" />}
                    >
                        <HiddenItem title="hidden1" onPress={() => alert('hidden1')} />                                   
                    </OverflowMenu>
                </HeaderButtons>  
            ),
        });
      }, [navigation]);

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
        headerTitle: 'Rekeningen',
    };
};

export default BillsOverviewScreen;