import React, { createContext, useContext, useEffect, useMemo } from 'react'
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import useAsyncStorage from './useAsyncStorage';
import moment from 'moment';


const NotificationsContext = createContext({});

    async function allowsNotificationsAsync() {
    Notifications.getPermissionsAsync().then(statusObj => {
        if(!statusObj.granted || statusObj.ios?.status !== Notifications.IosAuthorizationStatus.AUTHORIZED) {
            return Notifications.requestPermissionsAsync()
        }
        return statusObj
    }).then(statusObj => {
        if(statusObj.granted || statusObj.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL) {
            return;
        }
    })
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        enableLights: true,
      });
    }

  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


export const NotificationsProvider = ({children}) => { 
    const { storeNotification, deleteAllNotifications } = useAsyncStorage();
    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    const navigation = useNavigation();

    useEffect(() => {
        if(
            lastNotificationResponse &&
            lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER 
        ) {
            const linkNotificationToBillDetailScreen = async () => {
                try {
                    return await AsyncStorage.getItem('notifications').then(storedNotifications => {
                        const [billId] = Object.keys(Object.fromEntries(
                            Object.entries(JSON.parse(storedNotifications)).filter(([id, notifications]) => notifications.find(notificationId => 
                                notificationId === lastNotificationResponse.notification.request.identifier
                            ))
                    ));
        
                    navigation.navigate( 'Details', {
                            billId: billId,
                        }
                    )
                    });   
                } catch(e) {
                    console.log(e)
                }
            }

            linkNotificationToBillDetailScreen()
        }
      }, [lastNotificationResponse]);
      
    useEffect(() => {
      allowsNotificationsAsync();
    }, []);

    async function scheduleNotifications(billId, dateExpiry, title) {

        const settings = await AsyncStorage.getItem('settings').then(result => JSON.parse(result))
        const { isEnabled, daysBeforeFirstNotification, repeatNotification, notificationTime } = settings.push_notifications
        
        if(!isEnabled) return;

        const amountOfNotifications = Math.ceil(daysBeforeFirstNotification / repeatNotification)
       
        const hours = parseInt(moment(notificationTime).format('LT').slice(0,2))
        const minutes = parseInt(moment(notificationTime).format('LT').slice(3))
       
        const trigger1 = new Date(dateExpiry)
        trigger1.setHours(hours, minutes , 0);
        trigger1.setDate(trigger1.getDate() - daysBeforeFirstNotification)

        const trigger2 = new Date(dateExpiry);
        trigger2.setHours(hours, minutes, 0);
        trigger2.setDate(trigger2.getDate() + 7)

        const notification_ids = {
            [billId]: []
        }
        
        const dateNow = new Date(moment().startOf('day').format())

        for(let i= 0; i < amountOfNotifications; i++) {     //warning notifications
            if(trigger1 > dateNow) {
                await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: `Je hebt nog ${daysBeforeFirstNotification - (i * repeatNotification)}${''
                        } ${daysBeforeFirstNotification - (i * repeatNotification) === 1 ? 'dag' : 'dagen'} om deze rekening te betalen!`,
                },
                trigger: {
                    channelId: 'default',
                    date: trigger1
                }
                }).then(id => notification_ids[billId].push(id));;
            }
            trigger1.setDate(trigger1.getDate() + repeatNotification)
        }
        
        for(let i= 1; i <= 4; i++) {    //Overdue notifications
            if(trigger2 > dateNow) {    
                await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Billalert! 📬",
                    body: `Je bent ${i} ${i === 1 ? 'week' : 'weken'} te laat met betalen`,
                },
                trigger: {
                    channelId: 'default',
                    date: trigger2          
                }
                }).then(id => notification_ids[billId].push(id));;         
            }
            trigger2.setDate(trigger2.getDate() + 7)
        }
        storeNotification(notification_ids);
    }
    
    async function getScheduledNotifications() {
        await Notifications.getAllScheduledNotificationsAsync().then(result => console.log(result))
    }

    async function cancelAllScheduledNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync()
        deleteAllNotifications();
   }

   async function cancelScheduledNotification(id) {
    await Notifications.cancelScheduledNotificationAsync(id)
}


    const memoedValue = useMemo(() => ({
        scheduleNotifications,
        getScheduledNotifications,
        cancelAllScheduledNotifications,
        cancelScheduledNotification,
    }), [scheduleNotifications])
    
    return (
        <NotificationsContext.Provider 
            value={memoedValue}
            >
                {children}
        </NotificationsContext.Provider>
    );

}

export default function useNotifications() {
    return useContext(NotificationsContext);
}