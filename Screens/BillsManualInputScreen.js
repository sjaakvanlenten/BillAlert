import React, { useState, useCallback } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as billsActions from '../store/actions/bills';

const BillsManualInputScreen = props => {
    const [ title, setTitle] = useState('');
    const [ billAmount, setBillAmount] = useState('');
    const [ IBANo, setIBANo] = useState('');
    const [ reference, setReference] = useState('');
    const [ dateExpiry, setDateExpiry] = useState('');

    const dispatch = useDispatch();

    const submitHandler = useCallback( () => {
        dispatch(billsActions.createBill(title, billAmount, IBANo, reference, dateExpiry))
    }, [dispatch, title, billAmount, IBANo, reference, dateExpiry]);

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
                <View style={styles.formControl}>
                    <Text style={styles.label}>Vervaldatum</Text>
                    <TextInput 
                        style={styles.input} 
                        value={dateExpiry}
                        onChangeText={text => setDateExpiry(text)}
                    />
                </View>
                <View>
                    <Button
                        title="Opslaan"
                        color="#434381"
                        onPress={submitHandler}
                    />
                </View>
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