import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageContext = createContext({});

export const AsyncStorageProvider = ({children}) => {
    const [receiversList, setReceiversList] = useState({})
    const [settings, setSettings] = useState({})

    useEffect(() => {
        getReceiversList();
        getSettings();
    }, [])

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
            await AsyncStorage.mergeItem('settings', jsonValue)
        } catch (e) {
        // errr
        } finally {
            getSettings();
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

    const memoedValue = useMemo(() => ({
        settings,
        storeSettings,
        receiversList,
        storeReceiver,
        deleteReceiver,
    }), [receiversList, storeReceiver, deleteReceiver])

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