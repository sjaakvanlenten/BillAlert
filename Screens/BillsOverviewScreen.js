import React, { useState, useEffect, useCallback } from 'react';
import { useSelector} from 'react-redux';
import { View } from 'react-native';
import moment from 'moment';

import FilterMenu from '../components/UI/FilterMenu'
import SortingMenu from '../components/UI/SortingMenu'
import BillsList from '../components/BillsList';

const BillsOverviewScreen = props => {
    const { navigation } = props;

    /* Local State */
    const [availableBills, setAvailableBills] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [filters, setFilters] = useState({
        filterGreen: true,
        filterOrange: true,
        filterRed: true,
        filterPayedBills: false,
    })
    const [monthFilter, setMonthFilter] = useState(null)

    /* Fetch bills from redux store */
    const bills = useSelector(state => state.bills.bills)

    /* Set local state when redux store changes and check for month filter*/
    useEffect (() => {    
        if(monthFilter !== null) {
            setAvailableBills(bills.filter(bill =>
                moment(bill.dateExpiry).format('MMMM') == monthFilter.charAt(0).toLowerCase() + monthFilter.slice(1))
            )
        } else {
            setAvailableBills(bills);
        }
    }, [bills, monthFilter]);
    
    /* Set the header menu components */
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (   
                <View style={{flexDirection:'row', paddingRight: 12.5 }}>
                    <SortingMenu setBillsOrder={setBillsOrder} />
                    <FilterMenu filtersHandler={filtersHandler} filterMonthHandler={filterMonthHandler} />                   
                </View>                            
            ),
        });
      }, [navigation]);

    /* Setting the order of the bills for the listData from SortingMenu */  
    const setBillsOrder = useCallback((sortBy) => {
        setSortBy(sortBy);
    }, [sortBy]);

    /* Setting the filters for the listData from FilterMenu */
    const filtersHandler = useCallback((filter, value) => {
        setFilters(filters => ({ ...filters, [filter] : value})) 
    }, [filters]);

    const filterMonthHandler = useCallback((month) => {
        month === "Alle Maanden" ? setMonthFilter(null) : setMonthFilter(month);
    }, [monthFilter]);
    
    return (
        <BillsList 
            listData={availableBills} 
            navigation={props.navigation}  
            sortBy={sortBy}      
            filters={filters}
        />     
    );
}

export default BillsOverviewScreen;