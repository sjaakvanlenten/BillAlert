import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

import * as billsActions from '../store/actions/bills';
import HeaderButton from '../components/UI/HeaderButton';
import Colors from '../constants/Colors';

const BillDetailsScreen = ({navigation, route : {params : { billId }}}) => {
  
    const dispatch = useDispatch();

    const selectedBill = useSelector(state => state.bills.bills.find(bill => bill.id == billId), next => next === undefined);
    
    const daysDifference = moment.duration(moment(selectedBill.dateExpiry) - moment()).days();

    const deleteHandler = () => {        
        dispatch(billsActions.removeBill(billId))
        navigation.goBack();
    }

    const payBillHandler = () => {
        dispatch(billsActions.updatePaymentStatus(billId))
    }

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: selectedBill.title,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Edit"
                IconComponent={MaterialIcons}
                iconName="edit"
                onPress={() => {
                  navigation.navigate('ManualInputEdit', {
                      billId
                  });
                }}
              />
            </HeaderButtons>
          )
        });
      }, [selectedBill.title]);

    return (     
        <View style={{ flex: 1, backgroundColor: 'white'}}>
            
            <Card style={styles.cardContainer}>
                <Card.Content backgroundColor='white' style={{borderRadius: 10}}>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Ten name van</Text>
                        <Text style={styles.paragraph}>{selectedBill.receiver}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Aangemaakt op</Text>
                        <Text style={styles.paragraph}>{selectedBill.dateCreated}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Bedrag</Text>
                        <Text style={styles.paragraph}>{selectedBill.billAmount}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>IBAN</Text>
                        <Text style={styles.paragraph}>{selectedBill.IBANo}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Resterende dagen</Text>
                        <Text style={styles.paragraph}>{daysDifference >= 1 ? daysDifference : 0}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Status</Text>
                        {selectedBill.status === 1 ? <Text style={styles.paragraph}>Betaald</Text> : <Text style={styles.paragraph}>Open</Text>} 
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Vervaldatum</Text>
                        <Text style={styles.paragraph}>{moment(selectedBill.dateExpiry).format('LL')}</Text>
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Beschrijving</Text>
                        <Text style={styles.paragraph}>{selectedBill.reference}</Text>                     
                    </View>
                </Card.Content>
            </Card>
            <View style={styles.buttonContainer}>
                <Button 
                    onPress={deleteHandler}
                    mode="contained"
                    icon="trash-can-outline" 
                    color={Colors.billOverdue}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    uppercase= {false}
                    labelStyle={styles.buttonLabel}
                >
                    Verwijder
                </Button>
                <Button 
                    onPress={payBillHandler}
                    mode="contained" 
                    icon="check-bold"
                    color={Colors.primary}
                    style={styles.button}
                    contentStyle={[styles.buttonContent, {flexDirection: 'row-reverse'}]}
                    uppercase= {false}
                    labelStyle={styles.buttonLabel}
                >
                    Betaald
                </Button>
            </View>
        </View>  
    );
};

const styles = StyleSheet.create({
    cardContainer: {       
        borderRadius: 10,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        marginHorizontal: 25,
        marginTop: 25,
        elevation: 5,
        paddingBottom: 10,
    },
    buttonContainer: {
        flexDirection:'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 25,
        paddingHorizontal: 25 
    },
    cardContentItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        borderRadius: 50, 
        width: '45%',
        elevation: 5,
    },
    buttonContent: {
        paddingVertical: 8, 
        paddingHorizontal: 8,        
    },
    buttonLabel: {
        fontSize: 14, 
        fontFamily:'open-sans-semibold'
    },
    title: {
        fontFamily: 'montserrat-medium', 
        color: 'grey', 
        fontSize: 14,
    },
    paragraph: {
        fontSize: 16,
        fontFamily: 'montserrat-medium'
    }
});

export default BillDetailsScreen;