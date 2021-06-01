import React, { useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';

import FilterMenu from '../components/UI/FilterMenu'
import BillsList from '../components/BillsList';

import * as billsActions from '../store/actions/bills';

function mapStateToProps(state) {
    return { filters: state.filters }
  }

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
                <FilterMenu />                
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
            filter={props.filters.filters} 
        />
    );
}

export const screenOptions = () => {
    return {
        headerTitle: 'Rekeningen',
    };
};

export default connect(mapStateToProps)(BillsOverviewScreen)