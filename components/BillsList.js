import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import BillItem  from './BillItem'
import moment from 'moment';

const BillsList = props => {
    const filter = props.filters.filters
    
    const renderBillItem = itemData => {
        
        let showBillItem = false;
        const daysDifference = moment.duration(moment(itemData.item.dateExpiry) - moment()).days();
       
        if(filter[2] && daysDifference < 1) {
            showBillItem = true;
        } else if(filter[1] && daysDifference < 7 && daysDifference > 1) {
            showBillItem = true;
        } else if(filter[0] && daysDifference >= 7) {
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

function mapStateToProps(state) {
    return { filters: state.filters }
  }

const styles = StyleSheet.create({
    billsList: {
        backgroundColor: 'white',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      width: '100%'
    }
  });

export default connect(mapStateToProps)(BillsList)