import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider, Switch, Title } from 'react-native-paper';

import useAsyncStorage from '../../hooks/useAsyncStorage';
import Colors from '../../constants/Colors';

const SettingsScreen = () => {
    const { settings, storeSettings } = useAsyncStorage();
    const [isSwitchOn, setIsSwitchOn] = useState(settings.push_notifications);

    useEffect(() => {
        storeSettings({'push_notifications' : isSwitchOn})
    }, [isSwitchOn])

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.mainSetting}>
                    <Title style={styles.title}>Pushmeldingen</Title>
                    <Switch
                        trackColor={{ true: Colors.primary, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.primary : ''}
                        value={isSwitchOn}
                        onValueChange={onToggleSwitch}
                        style={styles.switch}
                    />
                </View>
                <Divider />
            </View>
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
    paragraph: {
        fontFamily: 'montserrat-medium',
        fontSize: 14,
      
    }
})

export default SettingsScreen