import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { View, Dimensions, BackHandler, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/core';
import { FAB, Snackbar } from 'react-native-paper';
import moment from 'moment';

import * as billsActions from '../store/actions/bills';
import FilterMenu from '../components/UI/FilterMenu';
import SortingMenu from '../components/UI/SortingMenu';
import BillsList from '../components/BillsList';
import InfoBar from '../components/InfoBar';
import CustomSearchbar from '../components/UI/CustomSearchbar';

const BillsOverviewScreen = ({bills, navigation, route}) => {
    const dispatch = useDispatch();

    /* Local State */
    const [availableBills, setAvailableBills] = useState([]);
    const [sortBy, setSortBy] = useState('dateCreated_up');
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
    const [snackBarvisible, setSnackbarVisible] = useState(false);

    const showSnackBar = () => setSnackbarVisible(true);
    const onDismissSnackBar = () => setSnackbarVisible(false);
    
    /*Show snackbar when bill is deleted */
    useEffect(() => {
          if(route.params?.billId) {
              showSnackBar();
          }
        }, [route.params])
 
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
        navigation.getParent().setOptions({
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
                        searchPressed={searchPressed}
                    />
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
    
    /* Android Backbutton will hide searchBar */
    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            if (searchPressed) {
              setSearchPressed(false);
              return true;
            } else {
              return false;
            }
          };
    
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [searchPressed])
    );  

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
                    margin: 24,
                    right: 0,
                    bottom: 0,           
                    backgroundColor: '#69699a',
                    transform: [{scaleX: 1.3}, {scaleY: 1.3}]
                  }}
                icon="plus"
                onPress={() => navigation.navigate('ManualInput')}
            />  
            <Snackbar
                style={{backgroundColor: '#464646'}}          
                visible={snackBarvisible}
                onDismiss={onDismissSnackBar}
                duration={5000}
                action={{
                label: 'Ongedaan maken',
                onPress: () => {
                    dispatch(billsActions.removeBill(route.params?.billId, true))
                },
                }}>
                Rekening verwijdert
            </Snackbar>
            {Platform.OS === 'ios' && <StatusBar style="light" />} 
        </View>
    );
}
const mapStateToProps = state => {
    return{
        bills: state.bills.bills.filter(bill => bill.deletionDate === null)
    }
}
export default connect(mapStateToProps)(BillsOverviewScreen);