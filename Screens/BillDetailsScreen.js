import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { BILLS } from '../data/dummy-data';

const BillDetailsScreen = props => {
    const { navigation } = props;
    const { billId, billTitle } = props.route.params;

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: billTitle
        });
      }, [navigation]);

    const selectedBill = useSelector(state => state.bills.bills.find(bill => bill.id == billId));
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{selectedBill.title}</Text>
        </View>
    );
};

export default BillDetailsScreen;