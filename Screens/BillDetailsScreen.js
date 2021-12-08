import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

import * as billsActions from '../store/actions/bills';
import HeaderButton from '../components/UI/HeaderButton';
import Colors from '../constants/Colors';

const BillDetailsScreen = ({navigation, route : {params : { billId, itemInfo }}}) => {
    const [billInfo, setBillInfo] = useState(itemInfo)
  
    const dispatch = useDispatch();

    const selectedBill = useSelector(state => state.bills.bills.find(bill => bill.id == billId), next => next === undefined);

    const paymentDateDaysDifference = moment(selectedBill.paymentDate).startOf('day').diff(
        moment(selectedBill.dateExpiry).startOf('day'), 
        'days'
    )

    const deleteHandler = () => {        
        dispatch(billsActions.removeBill(billId))
        navigation.goBack();
    }

    const payBillHandler = () => {
        setBillInfo(billInfo => {
            return {
                ...billInfo, 
                ['textColor'] : 'black',
                ['statusIcon'] : "check-circle", 
                ['cardColor'] : Colors.billPayed,
                }});
        dispatch(billsActions.updatePaymentDate(billId))
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
                        <Text style={styles.title}>Aangemaakt op</Text>
                        <Text style={styles.paragraph}>{moment(selectedBill.dateCreated).format('LL')}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Ten name van</Text>
                        <Text style={styles.paragraph}>{selectedBill.receiver}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Bedrag</Text>
                        <Text style={styles.paragraph}>{selectedBill.billAmount}</Text>                     
                    </View>
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>IBAN</Text>
                        <Text style={styles.paragraph}>{selectedBill.IBANo}</Text>                     
                    </View>
                    {selectedBill.reference !== '' &&
                        <View style={styles.cardContentItem}>
                            <Text style={styles.title}>Beschrijving</Text>
                            <Text style={styles.paragraph}>{selectedBill.reference}</Text>                     
                        </View>
                    }
                    <View style={styles.cardContentItem}>
                        <Text style={styles.title}>Betalen voor</Text>
                        <Text style={styles.paragraph}>{moment(selectedBill.dateExpiry).format('LL')}</Text>
                    </View>
                    <View style={[styles.cardContentItem, {marginBottom: 15}]}>
                        <Text style={styles.title}>Status</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.paragraph, {color: billInfo.textColor}]}>
                                {selectedBill.paymentDate !== null 
                                    ? `Betaald op ${moment(selectedBill.paymentDate).format('LL')}` 
                                    : billInfo.statusText
                                }
                            </Text>
                            <MaterialCommunityIcons
                                name={billInfo.statusIcon} 
                                size={20} color={billInfo.cardColor} 
                                style={{paddingLeft: 5, paddingTop: 2, }} 
                            />
                        </View>
                    </View>
                    {selectedBill.paymentDate !== null ?
                        <View style={[styles.cardContentItem, {
                                backgroundColor: paymentDateDaysDifference < 0 ? Colors.billPayed : Colors.billOverdue, 
                                alignSelf: 'flex-start', 
                                padding: 5, 
                                paddingHorizontal: 20,
                                borderRadius: 25,
                                marginBottom: 0,
                            }
                        ]}>        
                            <Text style={[styles.paragraph, {color: '#fff'}]}>
                                {paymentDateDaysDifference >= 0
                                    ? `${paymentDateDaysDifference+1} ${paymentDateDaysDifference === 0 ? 'dag' : 'dagen'} te laat betaald` 
                                    : 'Op tijd betaald'
                                }
                            </Text>                    
                        </View>
                    : 
                        <View style={[styles.cardContentItem, {marginBottom: 0}]}>        
                            <Text style={styles.title}>Resterende dagen</Text>
                            <Text style={styles.paragraph}>{itemInfo.headerText}</Text>                    
                        </View>        
                    }
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
                    onPress={selectedBill.paymentDate === null ? payBillHandler : null}
                    mode="contained" 
                    icon="check-bold"
                    color={selectedBill.paymentDate !== null ? Colors.billPayed : Colors.primary}
                    dark={true}
                    style={styles.button}
                    contentStyle={[styles.buttonContent, {flexDirection: 'row-reverse'}]}
                    uppercase={false}
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
    },
    buttonContainer: {
        flexDirection:'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 25,
        paddingHorizontal: 25 
    },
    cardContentItem: {
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