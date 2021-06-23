import React, { useState, useReducer, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Platform, } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput, Button } from 'react-native-paper';
import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';

import * as billsActions from '../store/actions/bills';
import Colors from '../constants/Colors';
import Input from '../components/UI/Input';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_INPUT_RESET = 'FORM_INPUT_RESET';

const initializer = initialState => initialState

const formReducer = (state, action) => {
    switch(action.type) {
        case FORM_INPUT_UPDATE: {
            const updatedValues = {
                ...state.inputValues,
                [action.input] : action.value
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.input] : action.isValid
            };
            let updatedFormIsValid = true;
            for (const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
            }
            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues
            };
        }
        case FORM_INPUT_RESET: {
            return initializer(action.value);   
        }
        default:
            return state;
    }
}

const BillsManualInputScreen = props => {

    const IBANbankCodeRef = useRef();
    const IBANaccountNumberRef = useRef();
    const billId = props.route.params ? props.route.params.billId : null;
    const editedBill = useSelector(state => state.bills.bills.find(bill => bill.id == billId))

    const initialState = {
        inputValues: {
            title: editedBill ? editedBill.title : '',
            billAmount: editedBill ? editedBill.billAmount : '',
            IBANcheckNumber: editedBill ? editedBill.IBANo.slice(2,4) : '',
            IBANbankCode: editedBill ? editedBill.IBANo.slice(4,8) : '',
            IBANaccountNumber: editedBill ? editedBill.IBANo.slice(8) : '',
            reference: editedBill ? editedBill.reference : '',
            dateExpiry: editedBill ? new Date(editedBill.dateExpiry) : new Date(moment())
        },
        inputValidities: {
            title: editedBill ? true : false,
            billAmount: editedBill ? true : false,
            IBANcheckNumber: editedBill ? true : false,
            IBANbankCode: editedBill ? true : false,
            IBANaccountNumber: editedBill ? true : false,
            reference: true,
            dateExpiry: true,
        },
        formIsValid: editedBill ? true : false
    }

    const [formState, dispatchFormstate] = useReducer(formReducer, initialState, initializer);
    const [datePicker, setdatePicker] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
          setIsSubmitted(false)
        });
    
        return unsubscribe;
      }, [props.navigation]);

    const dateChangeHandler = (event, selectedDate) => {
        const currentDate = selectedDate || formState.inputValues.dateExpiry;
        setdatePicker(Platform.OS === 'ios');
        dispatchFormstate({
            type: FORM_INPUT_UPDATE,
            value: currentDate,
            isValid: true,
            input: 'dateExpiry'
        });    
      };

    const showDatepicker = () => {
        setdatePicker(true);
      };
      
    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormstate({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
      }, [dispatchFormstate, ]);

    const focusNextInputHandler = (inputIdentifier, inputValue) => {
        switch(inputIdentifier){
            case 'IBANcheckNumber':
                if(inputValue.length == 2) {
                    IBANbankCodeRef.current.focus()
                }
            case 'IBANbankCode':
                if(inputValue.length == 4) {
                    IBANaccountNumberRef.current.focus()
                }    
        }      
    };

    const submitHandler = () => {
        if(!formState.formIsValid) {
            return;
        }
        
        const IBANo = 'NL'.concat(
            formState.inputValues.IBANcheckNumber, 
            formState.inputValues.IBANbankCode,
            formState.inputValues.IBANaccountNumber
            );

        if(editedBill) {
            dispatch(billsActions.updateBill(
                billId,
                formState.inputValues.title, 
                formState.inputValues.billAmount, 
                IBANo, 
                formState.inputValues.reference, 
                moment(formState.inputValues.dateExpiry).format()),
                
            );
        } else {
            dispatch(billsActions.createBill(
                formState.inputValues.title, 
                formState.inputValues.billAmount, 
                IBANo, 
                formState.inputValues.reference, 
                moment(formState.inputValues.dateExpiry).format())
            );
        }

        dispatchFormstate({
            type: FORM_INPUT_RESET,
            value: initialState
        });

        setIsSubmitted(true)
        props.navigation.goBack();        
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <Input
                    id='title'
                    label ="Titel"
                    style={{width: '50%'}} 
                    errorText ="Geef een geldige titel op!"
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue={editedBill ? editedBill.title : formState.inputValues.title}
                    initiallyValid={!!editedBill}
                    required
                    isSubmitted={isSubmitted}
                />                
                <Input
                    id='billAmount' 
                    label='Bedrag'
                    placeholder='€0,00'
                    errorText ="Geef een geldig bedrag op!"
                    style={{width: '50%'}} 
                    keyboardType='numeric'
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue={editedBill ? editedBill.billAmount : formState.inputValues.billAmount}
                    initiallyValid={!!editedBill}
                    required
                    isSubmitted={isSubmitted}
                />
                <View style={styles.iban}>
                    <Input
                        disabled = {true}
                        placeholder = 'NL'
                        value = 'NL'
                    />
                    <Input
                        id='IBANcheckNumber'
                        keyboardType='numeric'
                        placeholder = '00'                        
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedBill ? editedBill.IBANo.slice(2,4) : formState.inputValues.IBANcheckNumber}
                        initiallyValid={!!editedBill}
                        minLength={2}
                        maxLength={2}
                        isSubmitted={isSubmitted} 
                        focusNextInput={focusNextInputHandler}                     
                    />
                    <Input
                        ref={IBANbankCodeRef}
                        id='IBANbankCode'
                        autoCapitalize="characters"                        
                        placeholder='BANK'
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedBill ? editedBill.IBANo.slice(4,8) : formState.inputValues.IBANbankCode}
                        initiallyValid={!!editedBill}
                        minLength={4}                       
                        maxLength={4}
                        isSubmitted={isSubmitted} 
                        focusNextInput={focusNextInputHandler}  
                    />
                    <Input
                        ref={IBANaccountNumberRef}
                        id='IBANaccountNumber' 
                        placeholder='0000 0000 00'
                        keyboardType='numeric'                       
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}                                          
                        initialValue={editedBill ? editedBill.IBANo.slice(8) : formState.inputValues.IBANaccountNumber}
                        initiallyValid={!!editedBill}
                        required
                        minLength={10}
                        maxLength={10}
                        isSubmitted={isSubmitted}
                    />
                </View>               
                <Input 
                    id='reference'
                    label='Betalingskenmerk'
                    multiline
                    onInputChange={inputChangeHandler}
                    initialValue={editedBill ? editedBill.reference : formState.inputValues.reference}
                    initiallyValid={true}
                    touched={true}
                    isSubmitted={isSubmitted}
                />
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
                        value={moment(formState.inputValues.dateExpiry).format('LL')}                           
                    />          
                </View>
                <View style={{flexDirection:'row', width: '100%', justifyContent: 'center', flex: 1}}>
                    <Button 
                        mode="contained" 
                        disabled={!formState.formIsValid}
                        onPress={submitHandler} 
                        color={Colors.primary} 
                        style={styles.button}
                    >
                        Rekening Opslaan 
                    </Button>
                </View>
            </View>
            <View>
                {datePicker && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={formState.inputValues.dateExpiry}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={dateChangeHandler}
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
    iban: {       
        flex:1, 
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    button: {
        marginTop: 10,
        padding: 5
    },

});

export default BillsManualInputScreen;