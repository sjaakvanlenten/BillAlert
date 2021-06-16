import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

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
        <TouchableCmp onPress={props.onSelectBill}>
        <View style={[styles.billItem, {backgroundColor: 
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
    );
}

const styles = StyleSheet.create({
    billItem: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 10,
      padding: 20,
      elevation: 5,
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