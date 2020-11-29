import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

import BillItem  from './BillItem'

const BillsList = props => {
  
    const renderBillItem = itemData => {
        return (
          <BillItem
            title={itemData.item.title}
            dateCreated={itemData.item.dateCreated}
            dateExpiry={itemData.item.dateExpiry}
            billAmount={itemData.item.billAmount}
            status={itemData.item.status}
            urgency={itemData.item.urgency}
            onSelectBill={() => {
              props.navigation.navigate( 'Details', {
                  billId: itemData.item.id,
                  billTitle: itemData.item.title,
                }
              )
            }}
          />
        );
    };

    return (
        <View style={styles.billsList}>
        <FlatList
          data={props.listData}
          keyExtractor={(item, index) => item.id}
          renderItem={renderBillItem}
        />
      </View>
    );
};

const styles = StyleSheet.create({
    billsList: {
        backgroundColor: '#EEEEEE',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15
    }
  });

export default BillsList;