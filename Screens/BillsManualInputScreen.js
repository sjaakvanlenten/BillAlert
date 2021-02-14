import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';

import * as billsActions from '../store/actions/bills';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const BillsManualInputScreen = props => {
    const [ title, setTitle] = useState('');
    const [ billAmount, setBillAmount] = useState('');
    const [ IBANo, setIBANo] = useState('');
    const [ reference, setReference] = useState('');
    const [ dateExpiry, setDateExpiry] = useState(new Date(moment()));
   
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateExpiry;
        setShow(Platform.OS === 'ios');
        setDateExpiry(currentDate);     
      };

    const showDatepicker = () => {
        setShow(true);
      };

    const submitHandler = () => {
        dispatch(billsActions.createBill(title, billAmount, IBANo, reference, moment(dateExpiry).format()))
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Titel</Text>
                    <TextInput 
                        style={styles.input} 
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Bedrag</Text>
                    <TextInput 
                        style={styles.input} 
                        value={billAmount}
                        onChangeText={text => setBillAmount(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>IBAN nummer</Text>
                    <TextInput 
                        style={styles.input} 
                        value={IBANo}
                        onChangeText={text => setIBANo(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Betalingskenmerk</Text>
                    <TextInput 
                        style={styles.input} 
                        value={reference}
                        onChangeText={text => setReference(text)}    
                    />
                </View>
                <TouchableWithoutFeedback onPress={showDatepicker}>
                    <View style={styles.formControl}>                
                        <Text style={styles.label}>Vervaldatum</Text>                    
                        <TextInput 
                            style={styles.input} 
                            placeholder={moment().format('LL')}
                            onFocus={showDatepicker}
                            value={moment(dateExpiry).format('LL')}
                            showSoftInputOnFocus={false}
                            
                        />          
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Button
                        title="Opslaan"
                        color="#434381"
                        onPress={submitHandler}
                    />
                </View>
            </View>
            <View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateExpiry}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
});

export default BillsManualInputScreen;