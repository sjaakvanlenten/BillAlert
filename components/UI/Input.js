import React, { useReducer, useEffect, forwardRef} from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';
const INPUT_FOCUS = 'INPUT_FOCUS';
const INPUT_RESET = 'INPUT_RESET';

const initializer = initialState => initialState

const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            };
        case INPUT_FOCUS:
            return {
                ...state,
                touched: false
            };
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            };
        case INPUT_RESET:
            return initializer(action.value)
        default:
            return state;
    }
};

const Input = forwardRef((props, ref) => {
    
    const initialState = {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid,
        touched: props.touched ? true : false
    }

    const [inputState, dispatch] = useReducer( inputReducer, initialState, initializer);
    const { onInputChange, id, isSubmitted, focusNextInput } = props;

    useEffect(() => {
        if (inputState.touched) {
            onInputChange(id, inputState.value, inputState.isValid);
        }
    }, [inputState, onInputChange, id]);

    useEffect(() => {       
        if (focusNextInput) {
            focusNextInput(id, inputState.value);
        }
    }, [inputState.value]);

    useEffect(() => {
        if(isSubmitted) {
            dispatch({
                type: INPUT_RESET,
                value: initialState
            }); 
        }
    }, [isSubmitted, dispatch])

    const textChangeHandler = text => {
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
          }
        dispatch({type: INPUT_CHANGE, value: text, isValid: isValid });
    }

    const focusHandler = () => {
        dispatch({ type: INPUT_FOCUS });
    }

    const lostFocusHandler = () => {
        dispatch({ type: INPUT_BLUR });
    }
    
    return (
        <View>
            <TextInput 
                {...props}
                ref={ref}
                style = {props.iban ? [styles.input, styles.iban] : styles.input}
                label={props.label}
                value={inputState.value}
                onChangeText={textChangeHandler}
                onBlur={lostFocusHandler}
                onFocus={focusHandler}
            />
            { (!inputState.isValid && inputState.touched && !props.iban) &&
                <HelperText type="error" visible={!inputState.isValid && inputState.touched}>
                    {props.errorText}
                </HelperText>
            }
        </View>
    );
});

const styles = StyleSheet.create({
    input: {       
        paddingHorizontal: 2,
        paddingVertical: 2,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    iban: {
        marginRight: 5,
    }
});

export default Input;