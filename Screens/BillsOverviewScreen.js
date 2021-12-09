import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { useSelector} from 'react-redux';
import { View, Dimensions } from 'react-native';
import moment from 'moment';

import FilterMenu from '../components/UI/FilterMenu'
import SortingMenu from '../components/UI/SortingMenu'
import BillsList from '../components/BillsList';
import InfoBar from '../components/InfoBar';
import CustomSearchbar from '../components/UI/CustomSearchbar';
import { FAB } from 'react-native-paper';

const BillsOverviewScreen = ({navigation}) => {

    /* Local State */
    const [availableBills, setAvailableBills] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [filters, setFilters] = useState({
        filterGreen: true,
        filterOrange: true,
        filterRed: true,
        filterPayedBills: false,
        filterOnlyPayed: false,
    })
    const [monthFilter, setMonthFilter] = useState(null)
    const [searchPressed, setSearchPressed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    useLayoutEffect(() => {
        const stackNavigator = navigation.dangerouslyGetParent()
            stackNavigator.setOptions({
            headerTitle: !searchPressed ? 'Rekeningen' : '',
        
            headerRight: () => (   
                <View style={{flexDirection:'row', 
                    flex: 1, 
                    alignItems: 'center', 
                    paddingVertical: 10,
                    width: searchPressed ? Dimensions.get('window').width : '100%',
                    justifyContent: 'flex-end',
                    paddingLeft: 5,
                }}>
                    <CustomSearchbar 
                        setSearchPressHandler={setSearchPressHandler}
                        searchHandler={searchHandler}
                        searchPressed={searchPressed}/>
                    <SortingMenu setBillsOrder={setBillsOrder} />
                    <FilterMenu 
                        filtersHandler={filtersHandler} 
                        filterMonthHandler={filterMonthHandler} 
                        filters={filters}
                    />                   
                </View>                            
            ),
        });
      }, [navigation, searchPressed, filters, searchQuery]);
    
    const setSearchPressHandler = useCallback(() => {
        setSearchPressed(searchPressed => !searchPressed)
    }, [searchPressed]);

    const searchHandler = query => {
        setSearchQuery(query.trim().toLowerCase());
    }

    /* Setting the order of the bills for the listData from SortingMenu */  
    const setBillsOrder = useCallback((sortBy) => {
        setSortBy(sortBy);
    }, [sortBy]);

    /* Setting the filters for the listData from FilterMenu */
    const filtersHandler = useCallback((filter, value) => {
        if(filter === 'filterOnlyPayed') {
            setFilters(filters => ({
                ...filters, 
                ['filterGreen'] : value == true ? false : true,
                ['filterOrange'] : value == true ? false : true,
                ['filterRed'] : value == true ? false : true,
                ['filterPayedBills'] : value,
                ['filterOnlyPayed'] : value,
            })) 
        }
        else {
            setFilters(filters => ({ 
                ...filters, 
                [filter] : value,
                ['filterOnlyPayed'] : false
            })) 
        }
    }, [filters]);

    /* Setting the available bills filtered by month */
    const filterMonthHandler = useCallback((month) => {
        month === "Alle Maanden" ? setMonthFilter(null) : setMonthFilter(month);
    }, [monthFilter]);

    /* Calculating and storing the total billAmount */
    const totalBillAmount = useMemo(() => {
        return availableBills.reduce((total, bill) => {
            if(bill.paymentDate !== null) {
                return total          
            } else {           
                return total + parseFloat(bill.billAmount)
            }
        }, 0)
    }, [availableBills])

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <InfoBar 
                totalBillAmount={totalBillAmount}
                openBillsAmount={availableBills.filter(bill => bill.paymentDate === null).length}
            />
            <BillsList 
                listData={availableBills} 
                sortBy={sortBy}      
                filters={filters}
                searchQuery={searchQuery}
            />  
            <FAB
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#69699a'
                  }}
                icon="plus"
                onPress={() => navigation.navigate('ManualInput')}
            />  
        </View>
    );
}

export default BillsOverviewScreen;