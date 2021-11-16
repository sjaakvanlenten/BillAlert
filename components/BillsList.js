import React, { useState } from 'react';
import { View, FlatList, StyleSheet, } from 'react-native';

import BillItem  from './BillItem'
import moment from 'moment';

const BillsList = ({ navigation, listData , sortBy, filters }) => {
    const [currentSortby, setCurrentSortby] = useState('');
    
    function sortData(sortBy) {
        if(sortBy === currentSortby) {
            return listData
        }
        setCurrentSortby(sortBy)

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

    const renderBillItem = ({item}) => {
        let showBillItem = false;
        const daysDifference = moment.duration(moment(item.dateExpiry) - moment()).days();
       
        if(filters.filterRed && daysDifference < 1) {
            showBillItem = true;
        } else if(filters.filterOrange && daysDifference < 7 && daysDifference > 1) {
            showBillItem = true;
        } else if(filters.filterGreen && daysDifference >= 7) {
            showBillItem = true;
        }
        
        if(showBillItem) {
            return (
                <BillItem
                    title={item.title}
                    dateCreated={item.dateCreated}
                    dateExpiry={item.dateExpiry}
                    billAmount={item.billAmount}
                    status={item.status}
                    onSelectBill={() => {
                        navigation.navigate( 'Details', {
                            billId: item.id
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

const styles = StyleSheet.create({
    billsList: {
      backgroundColor: 'white',
      flex: 1,     
    }
  });

export default BillsList