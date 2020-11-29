import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import Colors from '../constants/Colors';
import BillItemText from './BillItemText';

const BillItem = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <TouchableCmp onPress={props.onSelectBill}>
        <View style={[styles.billItem, {backgroundColor: 
            props.urgency === 3 ? Colors.billOverdue : 
            props.urgency === 2 ? Colors.billUrgent :
            Colors.billNormal
        }]}>
                <BillItemText>{props.dateCreated} {'\u2022'} {props.billAmount}</BillItemText>
                <Text style={styles.title}>{props.title}</Text>
                <BillItemText>Vervaldatum: {props.dateExpiry}</BillItemText> 
                    {props.status == 1 ? <BillItemText>Betaald</BillItemText> : <BillItemText>Open</BillItemText>}         
        </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    billItem: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 10,
      padding: 10,
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