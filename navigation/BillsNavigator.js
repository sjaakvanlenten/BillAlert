import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import BillsOverviewScreen from '../Screens/BillsOverviewScreen';
import BillDetailsScreen from '../Screens/BillDetailsScreen';
import BillsManualInputScreen from '../Screens/BillsManualInputScreen';
import Colors from '../constants/Colors';
import { AsyncStorageProvider } from '../hooks/useAsyncStorage';
import HeaderButton from '../components/UI/HeaderButton';
import DrawerContent from '../components/DrawerContent';
import { DrawerActions } from '@react-navigation/native';

const defaultNavOptions = {
    headerTitleAlign: 'left',
    headerStyle: {
      backgroundColor: Platform.OS === 'android' ? Colors.primary : '',    
    },
    headerTitleStyle: {
      fontFamily: 'montserrat-medium',    
      fontSize: 20,  
      color: Platform.OS === 'android' ? 'white' : Colors.primary
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
  };
  
const Drawer = createDrawerNavigator();
const BillsStack = createStackNavigator();

const BillsStackScreen = () => {
    return (
        <BillsStack.Navigator screenOptions={defaultNavOptions}>
            <BillsStack.Screen 
                name="Overview" 
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
        </BillsStack.Navigator>
    );
}

const SideDrawer = () => {
    return (
        <Drawer.Navigator 
            screenOptions={{ 
                swipeEnabled: false,
            }}
            drawerStyle={{
                width: 240,
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
            <NavigationContainer>
                    <AsyncStorageProvider>
                        <BillsStackScreen />
                    </AsyncStorageProvider>          
            </NavigationContainer>
        </PaperProvider>
    );
};

export default BillsNavigator;