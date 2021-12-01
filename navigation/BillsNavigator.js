import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import BillsOverviewScreen from '../Screens/BillsOverviewScreen';
import BillDetailsScreen from '../Screens/BillDetailsScreen';
import BillsManualInputScreen from '../Screens/BillsManualInputScreen';
import Colors from '../constants/Colors';
import { AsyncStorageProvider } from '../hooks/useAsyncStorage';

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
    headerBackTitleStyle: {
      fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
  };

const BillsManualInputStack = createStackNavigator();
const BillsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BillsStackScreen = () => {
    return (
        <BillsStack.Navigator screenOptions={defaultNavOptions}>
            <BillsStack.Screen 
                name="Overview" 
                component={BillsOverviewScreen} 
                options={{headerTitle: 'Rekeningen', headerBackTitleVisible: false}}                            
            /> 
            <BillsStack.Screen 
                name="Details" 
                component={BillDetailsScreen} 
            />
            <BillsStack.Screen
                name="ManualInputEdit"
                component={BillsManualInputScreen} 
                options = {{ headerTitle: 'Wijzig Rekening' }}
                />
        </BillsStack.Navigator>
    );
}

const BillsManualInputStackScreen = () => {
    return (
    <BillsManualInputStack.Navigator screenOptions={defaultNavOptions}>
        <BillsManualInputStack.Screen
            name="ManualInputCreate"
            component={BillsManualInputScreen}
            options = {{ headerTitle: 'Nieuwe Rekening' }}
        />
    </BillsManualInputStack.Navigator>
    )
}

const HomeTabNavigator = () => {
    return(
    <Tab.Navigator 
    tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: 'gray',
        labelStyle: { fontFamily: 'montserrat-medium', fontSize: 12 },
        keyboardHidesTabBar: true
      }}
    >
        <Tab.Screen 
            name="Overview" 
            component={BillsStackScreen} 
            options ={ ({route}) => ({
                tabBarLabel: 'Overzicht',                
                tabBarVisible: shouldShowTabBar(route),
                tabBarIcon: ({color,size}) => {
                return <Ionicons name={'ios-list'} size={size} color={color} />
            }
        })}
        />
        <Tab.Screen 
            name="ManualInputTab" 
            component={BillsManualInputStackScreen}
            options ={ () => ({
                title: 'Nieuwe Rekening',
                tabBarIcon: ({color,size}) => {
                return <Ionicons name={'md-add-circle'} size={size} color={color} />
            }
        })}
        />
    </Tab.Navigator>
    )
};

const BillsNavigator = () => {
    return (
        <PaperProvider>
            <NavigationContainer>
                    <AsyncStorageProvider>
                        <HomeTabNavigator />  
                    </AsyncStorageProvider>          
            </NavigationContainer>
        </PaperProvider>
    );
};


function shouldShowTabBar(route) {

  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Overview';

  switch (routeName) {
    case 'Overview':
      return true
    case 'Details':
      return false;
    case 'ManualInputEdit':
      return false;
  }
}

export default BillsNavigator;

