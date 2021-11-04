import React, { useLayoutEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import * as billsActions from '../store/actions/bills';
import HeaderButton from '../components/UI/HeaderButton';


const BillDetailsScreen = props => {
    const { navigation } = props;
    const { billId, billTitle } = props.route.params;

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: billTitle,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Edit"
                IconComponent={MaterialIcons}
                iconName="edit"
                onPress={() => {
                  navigation.navigate('ManualInputEdit',{
                      billId: billId
                  });
                }}
              />
            </HeaderButtons>
          )
        });
      }, [navigation]);

    const selectedBill = useSelector(state => state.bills.bills.find(bill => bill.id == billId));
    
    const deleteHandler = () => {        
        dispatch(billsActions.removeBill(billId))
        navigation.goBack();
    }

    if(typeof selectedBill === "undefined")
    {
        return null;
    }

    return (     
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{selectedBill.title}</Text>
            <Text>{selectedBill.dateCreated}</Text>
            <Text>{selectedBill.dateExpiry}</Text>
            <Text>{selectedBill.IBANo}</Text>
            <Text>{selectedBill.reference}</Text>
            
            <Button
                title="Delete"
                color="#434381"
                onPress={deleteHandler}
            />
        </View>  
    );
};

export default BillDetailsScreen;