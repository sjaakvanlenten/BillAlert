import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import BillItem  from './BillItem'
import moment from 'moment';

const BillsList = props => {
    
    const renderBillItem = itemData => {

        let showBillItem = false;
        const daysDifference = moment.duration(moment(itemData.item.dateExpiry) - moment()).days();
       
        if(props.filter[2] && daysDifference < 1) {
            showBillItem = true;
        } else if(props.filter[1] && daysDifference < 7 && daysDifference > 1) {
            showBillItem = true;
        } else if(props.filter[0] && daysDifference >= 7) {
            showBillItem = true;
        }
        
        if(showBillItem) {
            return (
                <BillItem
                    title={itemData.item.title}
                    dateCreated={itemData.item.dateCreated}
                    dateExpiry={itemData.item.dateExpiry}
                    billAmount={itemData.item.billAmount}
                    status={itemData.item.status}
                    onSelectBill={() => {
                    props.navigation.navigate( 'Details', {
                        billId: itemData.item.id,
                        billTitle: itemData.item.title,
                        }
                    )
                    }}
                />
            );
        }
        else return null;
    };

    return (
        <View style={styles.billsList}>
        <FlatList
          data={props.listData}
          keyExtractor={(item, index) => item.id.toString()}
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