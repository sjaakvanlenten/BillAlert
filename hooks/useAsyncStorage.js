import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageContext = createContext({});

export const AsyncStorageProvider = ({children}) => {
    const [receiversList, setReceiversList] = useState({})

    useEffect(() => {
        getReceiversList();
    }, [])

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