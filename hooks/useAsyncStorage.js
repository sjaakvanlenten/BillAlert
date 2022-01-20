import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageContext = createContext({});

export const AsyncStorageProvider = ({children}) => {
    const [receiversList, setReceiversList] = useState({})
    const [settings, setSettings] = useState({})
    const [storedNotifications, setStoredNotifications] = useState({})

    useEffect(() => {
        getReceiversList();
        getSettings();
        getNotifications();
    }, [])

    useEffect(() => {
        init_user_settings();
    }, [init_user_settings])

    const init_user_settings = async () => {
        const keys = await AsyncStorage.getAllKeys()
      
        if (keys.includes('settings')) return

        const init_settings = {
            push_notifications: {
                isEnabled: true,
                daysBeforeFirstNotification: 14,
                repeatNotification: 3,
                notificationTime: new Date(1642158000000)
            }
        };
        storeSettings(init_settings)
    }

    const getSettings = async () => {
        try {
            const result = await AsyncStorage.getItem('settings')
            if(result !== null) setSettings(JSON.parse(result))
        } catch(e) {
          // error reading value
        }
    }

    const storeSettings = async (settingsData) => {
        try {
            const jsonValue = JSON.stringify(settingsData)
            await AsyncStorage.setItem('settings', jsonValue)
            setSettings(settingsData);
        } catch (e) {
        // errr
        } finally {
            
        }
    }

    const getReceiversList = async () => {
        try {
            const result = await AsyncStorage.getItem('receivers')
            if(result !== null) setReceiversList(JSON.parse(result))
        } catch(e) {
          // error reading value
        }
    }

    const storeReceiver = async (receiverData) => {
        try {
            const jsonValue = JSON.stringify(receiverData)
            await AsyncStorage.mergeItem('receivers', jsonValue)
        } catch (e) {
        // errr
        } finally {
            getReceiversList();
        }
    }

    const deleteReceiver = async (receiverData) => {
        try {
        const jsonValue = JSON.stringify(
            Object.fromEntries(
                Object.entries(receiversList).filter(receiver => receiver[1] !== receiverData)
        ));
        await AsyncStorage.setItem('receivers', jsonValue)
        } catch(e) {
          // save error
        } finally {
            getReceiversList();
        }
    }

    const getNotifications = async () => {
        try {
            const result = await AsyncStorage.getItem('notifications')
            if(result !== null) setStoredNotifications(JSON.parse(result))
        } catch(e) {
          // error reading value
        }
    }

    const storeNotification = async (notification_ids) => {
        try {     
            const jsonValue = JSON.stringify(notification_ids)
            await AsyncStorage.mergeItem('notifications', jsonValue)
            const result = await AsyncStorage.getItem('notifications')  
            if(result !== null) setStoredNotifications(JSON.parse(result))
        } catch (e) {
           
        } 
    }

    const deleteStoredNotification = async (billId) => {
        try {     
            const jsonValue = JSON.stringify(
                Object.fromEntries(
                    Object.entries(storedNotifications).filter(([id, notifications]) => id != billId)
            ));
            await AsyncStorage.setItem('notifications', jsonValue);
            setStoredNotifications(JSON.parse(jsonValue))
        } catch (e) {
           
        }        
    }

    const deleteAllNotifications = async () => {
        try {     
            await AsyncStorage.removeItem('notifications')
            setStoredNotifications({})
        } catch (e) {
           
        } 
    }    

    const memoedValue = useMemo(() => ({
        storedNotifications,
        getSettings,
        settings,
        storeSettings,
        receiversList,
        storeReceiver,
        deleteReceiver,
        storeNotification,
        deleteStoredNotification,
        deleteAllNotifications,
    }), [receiversList, storeReceiver, deleteReceiver, settings, storedNotifications])

    return (
        <AsyncStorageContext.Provider 
            value={memoedValue}
            >
                {children}
        </AsyncStorageContext.Provider>
    );
};

export default function useAsyncStorage() {
    return useContext(AsyncStorageContext);
}