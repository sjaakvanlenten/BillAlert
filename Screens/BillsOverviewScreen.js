import React, { useState, useEffect } from 'react';
import { useSelector} from 'react-redux';
import { View } from 'react-native';

import FilterMenu from '../components/UI/FilterMenu'
import SortingMenu from '../components/UI/SortingMenu'
import BillsList from '../components/BillsList';

const BillsOverviewScreen = props => {
    const { navigation } = props;

    /* Local State */
    const [availableBills, setAvailableBills] = useState([]);
    const [sortBy, setSortBy] = useState('');
    
    /* Fetch bills from redux store */
    const bills = useSelector(state => state.bills.bills);

    /* Set local state when redux store changes */
    useEffect (() => {
        setAvailableBills(bills);
    }, [bills]);
    
    /* Set the header menus */
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (   
                <View style={{flexDirection:'row'}}>
                    <SortingMenu setBillsOrder={setBillsOrder} />
                    <FilterMenu />                   
                </View>                            
            ),
        });
      }, [navigation]);

    /* Setting the order of the bills for the listData from SortingMenu */  
    function setBillsOrder(sortBy) {
        setSortBy(sortBy);
    }

    return (
        <BillsList 
            listData={availableBills.slice().filter(bill => bill.status == 0)} 
            navigation={props.navigation}  
            sortBy={sortBy}      
        />     
    );
}

export const screenOptions = () => {
    return {
        headerTitle: 'Rekeningen',
    };
};

export default BillsOverviewScreen;