import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import BillItem  from './BillItem'
import moment from 'moment';

const BillsList = ({ navigation, listData , sortBy, filters:{filters} }) => {

    function sortData(sortBy) {
        switch (sortBy) {
            case 'title': {
                return listData.sort((a, b) => a.title < b.title ? -1 : (a.title > b.title ? 1 : 0))
            };
            case 'dateExpiry_up': {
                return listData.sort((a,b) => new Date(b.dateExpiry) - new Date(a.dateExpiry));        
            };
            case 'dateExpiry_down': {
                return listData.sort((a,b) => new Date(a.dateExpiry) - new Date(b.dateExpiry));         
            };
            case 'dateCreated_up': {
                return listData.sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            };
            case 'dateCreated_down': {
                return listData.sort((a,b) => new Date(a.dateCreated) - new Date(b.dateCreated));
            };            
            default: 
                return listData               
        }
    }
    
    const renderBillItem = itemData => {
        
        let showBillItem = false;
        const daysDifference = moment.duration(moment(itemData.item.dateExpiry) - moment()).days();
       
        if(filters[2] && daysDifference < 1) {
            showBillItem = true;
        } else if(filters[1] && daysDifference < 7 && daysDifference > 1) {
            showBillItem = true;
        } else if(filters[0] && daysDifference >= 7) {
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
                        navigation.navigate( 'Details', {
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
                data={sortData(sortBy)}
                keyExtractor={item => item.id.toString()}
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
    }
  });

export default connect(mapStateToProps)(BillsList)