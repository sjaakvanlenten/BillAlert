import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { View } from 'react-native';

import FilterMenu from '../components/UI/FilterMenu'
import SortingMenu from '../components/UI/SortingMenu'
import BillsList from '../components/BillsList';

import * as billsActions from '../store/actions/bills';

const BillsOverviewScreen = props => {
    const { navigation } = props;
  
    const [availableBills, setAvailableBills] = useState([]);
    
    const bills = useSelector(state => state.bills.bills);
    
    useEffect (() => {
        setAvailableBills(bills);
    }, [bills]);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(billsActions.loadBills());
    }, [dispatch]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (   
                <View style={{flexDirection:'row'}}>
                    <SortingMenu sortBills={sortBills} />
                    <FilterMenu />                   
                </View>                            
            ),
        });
      }, [navigation]);

    function sortBills(sortBy) {
        switch (sortBy) {
            case 'title': {
                  setAvailableBills(availableBills => availableBills.slice().sort((a, b) => a.title < b.title ? -1 : (a.title > b.title ? 1 : 0)))
                break;
            };
            case 'dateExpiry_up': {
                  setAvailableBills(availableBills => availableBills.slice().sort((a,b) => new Date(b.dateExpiry) - new Date(a.dateExpiry)));  
                break;        
            };
            case 'dateExpiry_down': {
                 setAvailableBills(availableBills => availableBills.slice().sort((a,b) => new Date(a.dateExpiry) - new Date(b.dateExpiry)));  
                break;          
            };
            case 'dateCreated_up': {
                 setAvailableBills(availableBills => availableBills.slice().sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
                break;
            };
            case 'dateCreated_down': {
                 setAvailableBills(availableBills => availableBills.slice().sort((a,b) => new Date(a.dateCreated) - new Date(b.dateCreated)));
                break;
            };
            default: 
                return availableBills               
        }
    }

    return (
        <BillsList 
            listData={availableBills.slice().filter(bill => bill.status == 0)} 
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