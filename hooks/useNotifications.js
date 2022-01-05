import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications';

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
    const [notification, setNotification] = useState(false);
    const [scheduledNotifications, setScheduledNotifications] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
      allowsNotificationsAsync();
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    async function schedulePushNotification() {
        const trigger = new Date(Date.now() + 8000);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
          },
          trigger
        });
      }
    
    async function getScheduledNotifications() {
        Notifications.getAllScheduledNotificationsAsync().then(result => console.log(result))
    }

    const memoedValue = useMemo(() => ({
        schedulePushNotification,
        scheduledNotifications,
        getScheduledNotifications,
    }), [scheduledNotifications])
    
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