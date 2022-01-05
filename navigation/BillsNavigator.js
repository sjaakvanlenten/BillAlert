import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';

import BillsOverviewScreen from '../Screens/BillsOverviewScreen';
import BillDetailsScreen from '../Screens/BillDetailsScreen';
import BillsManualInputScreen from '../Screens/BillsManualInputScreen';
import SettingsScreen from '../Screens/Modals/SettingsScreen';
import deletedBillsScreen from '../Screens/Modals/deletedBillsScreen';

import { AsyncStorageProvider } from '../hooks/useAsyncStorage';
import { NotificationsProvider } from '../hooks/useNotifications';

import Colors from '../constants/Colors';
import HeaderButton from '../components/UI/HeaderButton';
import DrawerContent from '../components/DrawerContent';

const defaultNavOptions = {
    headerBackTitleVisible: false,
    headerTitleAlign: 'left',
    headerStyle: {
      backgroundColor: Colors.primary, 
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: 'montserrat-medium',    
      fontSize: 20,  
      color: 'white'
    },
    headerTintColor: 'white'
  };
  
const Drawer = createDrawerNavigator();
const BillsStack = createStackNavigator();

const BillsStackScreen = () => {
    return (
        <BillsStack.Navigator screenOptions={defaultNavOptions}>
            <BillsStack.Group>
                <BillsStack.Screen 
                    name="Home" 
                    component={SideDrawer} 
                    options={({navigation}) => ({
                        headerBackTitleVisible: false,
                        headerLeft: () => (
                            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                            <Item
                                style={{marginRight: 0}}
                                title="Drawer"
                                IconComponent={MaterialIcons}
                                iconName="menu"
                                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}                
                            />
                        </HeaderButtons>
                        )
                    })}                            
                /> 
                <BillsStack.Screen 
                    name="Details" 
                    component={BillDetailsScreen} 
                />
                <BillsStack.Screen
                    name="ManualInput"
                    component={BillsManualInputScreen} 
                />
            </BillsStack.Group>
            <BillsStack.Group screenOptions={
                { 
                    presentation: "modal" 
                }
            }>
                <BillsStack.Screen name="Settings" component={SettingsScreen} options={{headerTitle: 'Instellingen'}}/>
                <BillsStack.Screen name="Trash" component={deletedBillsScreen} options={{headerTitle: 'Prullenbak'}}/>
            </BillsStack.Group>
        </BillsStack.Navigator>
    );
}

const SideDrawer = () => {
    return (
        <Drawer.Navigator 
            screenOptions={{ 
                swipeEnabled: false,
                headerShown: false,
                drawerStyle: {
                    backgroundColor: Colors.primary,
                    width: 240
                }
            }}
            drawerContent={props => <DrawerContent {...props} />}
        >
        <Drawer.Screen name='Overview' component={BillsOverviewScreen}/>    
        </Drawer.Navigator>
    );
}

const BillsNavigator = () => {
    return (
        <PaperProvider>
            <NavigationContainer theme={{ colors: { background: Colors.primary } }}>
                    <AsyncStorageProvider>
                        <NotificationsProvider>
                            <BillsStackScreen />
                        </NotificationsProvider>
                    </AsyncStorageProvider>          
            </NavigationContainer>
        </PaperProvider>
    );
};

export default BillsNavigator;