import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  Platform, TouchableNativeFeedback } from 'react-native';

import Colors from '../constants/Colors';
import BillItemText from './BillItemText';
import moment from 'moment';

const BillItem = props => {

    let TouchableCmp = TouchableOpacity;

    let daysDifference = moment.duration(moment(props.dateExpiry) - moment()).days();

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.billItem}>
            <TouchableCmp style={{ flex: 1 }} onPress={props.onSelectBill}>
                <View style={[styles.container, {backgroundColor: 
                    daysDifference < 1 ? Colors.billOverdue : 
                    daysDifference < 7 ? Colors.billUrgent :
                    Colors.billNormal
                }]}>
                        <BillItemText>{props.dateCreated} {'\u2022'} {props.billAmount}</BillItemText>
                        <Text style={styles.title}>{props.title}</Text>
                        <BillItemText>Vervaldatum: {moment(props.dateExpiry).format('LL')}</BillItemText> 
                        {props.status === 1 ? <BillItemText>Betaald</BillItemText> : <BillItemText>Open</BillItemText>}     
                </View>
            </TouchableCmp>
        </View>
    );
}

const styles = StyleSheet.create({
    billItem: {     
        flex: 1,   
        borderRadius: 10,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        marginHorizontal: 25,
        marginVertical: 15,
        elevation: 6,
    },
    container: {
        flex: 1,   
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
    },
    white: {
        fontFamily: 'open-sans-bold',
        color: '#FFFFFF'
    },
    title: {
        fontFamily: 'open-sans-bold', 
        color: 'white', 
        fontSize: 20,
    }
});

export default BillItem;