import React, { useReducer, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {  useNavigation } from '@react-navigation/native';
import { Button, Portal, Dialog, Paragraph, Divider, Headline, Subheading, Switch, Title } from 'react-native-paper';
import { HeaderBackButton } from '@react-navigation/elements'
import Slider from '@react-native-community/slider';
import _ from 'lodash'

import useAsyncStorage from '../../hooks/useAsyncStorage';
import Colors from '../../constants/Colors';

const ENABLE_NOTIFICATION = 'ENABLE_NOTIFICATION';
const WHEN_START_NOTIFICATION = 'WHEN_START_NOTIFICATION';
const REPEAT_NOTIFICATION = 'REPEAT_NOTIFICATION';

const settingsReducer = (state, action) => {
    switch (action.type) {
        case ENABLE_NOTIFICATION:
            return {
                ...state,
                push_notifications: {
                    ...state.push_notifications,
                    isEnabled: !state.push_notifications.isEnabled
                }
            };
        case WHEN_START_NOTIFICATION:
            return {
                ...state,
                push_notifications: {
                    ...state.push_notifications,
                    daysBeforeFirstNotification: action.value
                }
            };
        case REPEAT_NOTIFICATION:
            return {
                ...state,
                push_notifications: {
                    ...state.push_notifications,
                    repeatNotification: action.value
                }
            };
        default:
            return state;
    }
};

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { settings, storeSettings } = useAsyncStorage();
    const [notificationsDialogVisible, setNotificationsDialogVisible] = useState(false);

    const initialState = {
        push_notifications: {
            isEnabled: settings.push_notifications.isEnabled,
            daysBeforeFirstNotification: settings.push_notifications.daysBeforeFirstNotification,
            repeatNotification: settings.push_notifications.repeatNotification,
        }
    }

    const [settingsState, dispatch] = useReducer( settingsReducer, initialState);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: (props) => {
                return (
                    <HeaderBackButton {...props} onPress={() => {
                        if(!_.isEqual(settingsState, settings)) {
                            storeSettings(settingsState)
                        }
                        navigation.goBack()
                    }}/>                      
                )                
            }
        });
    }, [navigation, settingsState]);

    const showNotificationsDialog = () => setNotificationsDialogVisible(true);

    const hideNotificationsDialog = () => setNotificationsDialogVisible(false);

    const notificationsToggleSwitch = () => {
       settingsState.push_notifications.isEnabled ? 
       showNotificationsDialog() : 
       dispatch({type: ENABLE_NOTIFICATION})
    }

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.mainSetting}>
                    <Title style={styles.title}>Pushmeldingen</Title>
                    <Switch
                        trackColor={{ true: Colors.primary, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.primary : ''}
                        value={settingsState.push_notifications.isEnabled}
                        onValueChange={notificationsToggleSwitch}
                        style={styles.switch}
                    />
                </View>
                <Divider />
                <View style={{paddingLeft: 20, paddingTop: 15,}}>
                    <Subheading style={[
                        styles.subHeading,
                        {color: settingsState.push_notifications.isEnabled ? 'black' : "#b7b7be"}
                    ]}>
                        Aantal dagen van tevoren melden:
                    </Subheading>
                    <Headline style={[
                        styles.headLine,
                        {color: settingsState.push_notifications.isEnabled ? Colors.primary : "#b7b7be"}
                    ]}>
                        {settingsState.push_notifications.daysBeforeFirstNotification}
                    </Headline>
                    <Slider
                        style={{width: 300, height: 40, marginLeft: -15}}
                        minimumValue={1}
                        maximumValue={14}
                        value={settings.push_notifications.daysBeforeFirstNotification}
                        step={1}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor="#b7b7be"
                        thumbTintColor={settingsState.push_notifications.isEnabled ? Colors.primary : "#b7b7be"}
                        onValueChange={val => dispatch({type: WHEN_START_NOTIFICATION, value: val })}
                        disabled={!settingsState.push_notifications.isEnabled}
                    />
                </View>
                <View style={{paddingLeft: 20, paddingVertical: 15,}}>
                    <Subheading style={[
                        styles.subHeading,
                        {color: settingsState.push_notifications.isEnabled ? 'black' : "#b7b7be"}
                    ]}>
                        Herhalen:
                    </Subheading>
                    <Headline style={[
                        styles.headLine,
                        {color: settingsState.push_notifications.isEnabled ? Colors.primary : "#b7b7be"}
                    ]}>
                        {settingsState.push_notifications.repeatNotification == 1 ? 'Dagelijks' :
                         settingsState.push_notifications.repeatNotification >=7 ? 'Wekelijks'
                         : `Elke ${settingsState.push_notifications.repeatNotification} dagen`}
                    </Headline>
                    <Slider
                        style={{width: 300, height: 40, marginLeft: -15}}
                        minimumValue={1}
                        maximumValue={7}
                        value={-Math.abs(settings.push_notifications.repeatNotification -1) + 7}
                        step={1}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor="#b7b7be"
                        thumbTintColor={settingsState.push_notifications.isEnabled ? Colors.primary : "#b7b7be"}
                        onValueChange={val => dispatch({type: REPEAT_NOTIFICATION, value: Math.abs(val -7) +1 })}
                        disabled={!settingsState.push_notifications.isEnabled}
                    />
                </View>
                <Divider />
            </View>
            <Portal>
                <Dialog visible={notificationsDialogVisible} onDismiss={hideNotificationsDialog}>
                    <Dialog.Content>
                        <Paragraph style={{fontFamily: 'montserrat-regular', fontSize: 16}}>
                            Weet zeker dat je meldingen wilt uitschakelen?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{justifyContent: 'space-between', paddingHorizontal: 45}}>
                        <Button color={Colors.primary} onPress={() => hideNotificationsDialog()}>Annuleren</Button>
                        <Button color={Colors.primary} onPress={() => {dispatch({type: ENABLE_NOTIFICATION}); hideNotificationsDialog()}}>
                            Uitschakelen
                        </Button>
                    </Dialog.Actions> 
                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1, 
        backgroundColor: 'white', 
        alignItems: 'center',
    },
    container: {
        width: '85%', 
    },
    mainSetting: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    settingOptionsContainer: {
        paddingHorizontal: 10,
    },
    settingOption: {
        marginTop: 10,
    },
    switch: {
        transform: Platform.OS === 'ios' ? [{scaleX: 0.8}, {scaleY: 0.8}] : [{scaleX: 1.2}, {scaleY: 1.2}],
    },
    title: {
        fontFamily: 'montserrat-semibold',
        fontSize: 18,
        color: Colors.primary,
    },
    subHeading: {
        fontFamily: 'montserrat-semibold',
        fontSize: 14,
    },
    headLine: {
        fontFamily: 'montserrat-semibold',
        fontSize: 20,
    },
    paragraph: {
        fontFamily: 'montserrat-medium',
        fontSize: 14,
      
    }
})

export default SettingsScreen