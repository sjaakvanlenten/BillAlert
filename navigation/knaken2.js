import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import BillsOverviewScreen, { screenOptions as BillsOverviewOptions} from '../Screens/BillsOverviewScreen';
import BillDetailsScreen from '../Screens/BillDetailsScreen';
import BillsManualInputScreen, { screenOptions as ManualInputOptions} from '../Screens/BillsManualInputScreen';
import Colors from '../constants/Colors';

const BillsManualInputStack = createStackNavigator();
const BillsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BillsStackScreen = () => {
    return (
        <BillsStack.Navigator>
            <BillsStack.Screen 
                name="Overview" 
                component={HomeTabNavigator} 
                options={ ({route}) => ({
                        ...BillsOverviewOptions(),
                        headerTitle: getHeaderTitle(route),
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: Colors.primary,
                        },
                        headerTintColor: '#fff',
                    
                        })}
                
            /> 
            <BillsStack.Screen 
                name="Details" 
                component={BillDetailsScreen} 
                options={{ 
                    headerTitle: 'Details',
                    headerStyle: {
                        backgroundColor: Colors.primary,
                    },
                    headerTintColor: '#fff',
                }}
            /> 
        </BillsStack.Navigator>
    );
}

const BillsManualInputStackScreen = () => {
    return (
    <BillsManualInputStack.Navigator>
        <BillsManualInputStack.Screen
            name="manualinput"
            title="Invoer"
            component={BillsManualInputScreen}
            options={{ headerTitle: 'invoer'}}
        />
    </BillsManualInputStack.Navigator>
    )
}

const HomeTabNavigator = () => {
    return(
    <Tab.Navigator>
        <Tab.Screen 
            name="Overview" 
            title="Overzicht"
            component={BillsOverviewScreen} 
            options ={ () => ({
                tabBarIcon: ({color,size}) => {
                return <Ionicons name={'ios-list'} size={size} color={color} />
            }
        })}
        />
        <Tab.Screen 
            name="Invoeren" 
            title="invoeren"
            component={BillsManualInputStackScreen}
            options ={ () => ({
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
        <NavigationContainer>
            <BillsStackScreen />
        </NavigationContainer>
    );
};


function getHeaderTitle(route) {

  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Overview';

  switch (routeName) {
    case 'Overview':
      return 'Open Rekeningen';
    case 'Invoeren':
      return 'Invoeren';
  }
}

export default BillsNavigator;

