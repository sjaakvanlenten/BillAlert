import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput, Button } from 'react-native-paper';
import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';

import * as billsActions from '../store/actions/bills';
import Colors from '../constants/Colors';

const BillsManualInputScreen = props => {
    
    const billId = props.route.params ? props.route.params.billId : null;
    const editedBill = useSelector(state => state.bills.bills.find(bill => bill.id == billId))

    const [ title, setTitle] = useState(editedBill ? editedBill.title : '');
    const [ billAmount, setBillAmount] = useState(editedBill ? editedBill.billAmount : '');
    const [ IBANo, setIBANo] = useState('');
    const [ reference, setReference] = useState(editedBill ? editedBill.reference : '');
    const [ dateExpiry, setDateExpiry] = useState(editedBill ? new Date(editedBill.dateExpiry) : new Date(moment()));

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
        if(editedBill){
            dispatch(billsActions.updateBill(
                billId,
                title, 
                billAmount, 
                IBANo, 
                reference, 
                moment(dateExpiry).format()),
                
            );
        } else{
            dispatch(billsActions.createBill(
                title, 
                billAmount, 
                IBANo, 
                reference, 
                moment(dateExpiry).format())
            );
        }

    }

  
    return (
        <ScrollView>
            <View style={styles.form}>
                    <TextInput 
                        mode = 'outlined'
                        label='Titel'
                        outlineColor='green'
                        style={[styles.input, {width: '50%'}]} 
                        value={title}
                        onChangeText={text => setTitle(text)}
                        autoFocus={true}

                    />
             
                <View style={styles.formControl}>
                    
                    <TextInput 
                        mode = 'outlined'
                        label='Bedrag'
                        outlineColor={Colors.primary}
                        style={[styles.input, {width: '30%'}]} 
                        value={billAmount}
                        onChangeText={text => setBillAmount(text)}
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.formControl}>
                    <View style={styles.iban}>
                    <TextInput
                        mode = 'outlined'
                        disabled = {true}
                        placeholder = 'NL'
                        value = 'NL'
                        style={[styles.input, {width: '15%'}]}
                    />
                    <TextInput
                        mode = 'outlined'
                        keyboardType='numeric'
                        placeholder = '00'
                        style={[styles.input, {width: '15%'}]}
                    />
                    <TextInput
                        mode = 'outlined'
                        autoCapitalize="characters"
                        label='Bank'
                        style={[styles.input, {width: '25%'}]}
                    />
                    <TextInput 
                        mode = 'outlined'
                        placeholder='0000 0000 00'
                        keyboardType='numeric'
                        outlineColor={Colors.primary}
                        style={[styles.input, {width: '40%'}]}
                        value={IBANo}
                        onChangeText={text => setIBANo(text)}
                    />
                    </View>
                </View>
                <View style={styles.formControl}>
                    
                    <TextInput 
                        mode = 'outlined'
                        label='Betalingskenmerk'
                        style={styles.input} 
                        value={reference}
                        multiline={true}
                        outlineColor={Colors.primary}
                        onChangeText={text => setReference(text)}    
                    />
                </View>
                <View style={{flexDirection:'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', flex: 1}}>               
                <Button 
                        mode="contained" 
                        onPress={showDatepicker} 
                        color={Colors.primary} 
                    >
                        Selecteer datum 
                    </Button>                          
                        <TextInput 
                            mode = 'outlined'
                            label='Vervaldatum'
                            outlineColor={Colors.primary}
                            disabled = {true}
                            style={styles.input} 
                            placeholder={moment().format('LL')}
                            value={moment(dateExpiry).format('LL')}
                            
                        />          
                    </View>
                <View style={{flexDirection:'row', width: '100%', justifyContent: 'center', flex: 1}}>
                    <Button 
                        mode="contained" 
                        onPress={submitHandler} 
                        color={Colors.primary} 
                        style={styles.button}
                    >
                        Rekening Opslaan 
                    </Button>
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
        margin: 30
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
    },
    button: {
        marginTop: 10,
        padding: 5
    },
    iban: {
        flexDirection:'row',
        justifyContent: 'space-between'

    }
});

export default BillsManualInputScreen;