import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';

import BillsOverviewScreen, { screenOptions as BillsOverviewOptions} from '../Screens/BillsOverviewScreen';
import BillDetailsScreen from '../Screens/BillDetailsScreen';
import BillsManualInputScreen from '../Screens/BillsManualInputScreen';
import Colors from '../constants/Colors';

const Stack = createStackNavigator();
const BillsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BillsStackScreen = ({ navigation, route }) => {
    if (route.state) {
        navigation.setOptions({
            tabBarVisible: route.state.index > 0 ? false: true
        });
    }
    return (
        <BillsStack.Navigator>
            <BillsStack.Screen 
                name="Overview" 
                component={BillsOverviewScreen} 
                options={{...BillsOverviewOptions(),
                    headerTitle: 'Open Rekeningen',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: Colors.primary,
                    },
                    headerTintColor: '#fff',
                }}
                
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

const HomeTabNavigator = () => (
    <Tab.Navigator screenOptions={({route}) => ({
        tabBarIcon:({color,size}) => {
            let iconName
            if(route.name == 'Overview')
            {
                iconName = 'ios-list'
            }
            else if(route.name == 'Invoeren')
            {
                iconName = 'md-add-circle'
            }
            return <Ionicons name={iconName} size={size} color={color} />
        }
    })}>
        <Tab.Screen 
            name="Overview" 
            title="Overzicht"
            component={BillsStackScreen} 
        />
        <Tab.Screen 
            name="Invoeren" 
            component={BillsManualInputScreen}
        />
    </Tab.Navigator>
);

const BillsNavigator = props => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    options={({route}) =>({
                        title:getHeaderTitle(route),
                        headerShown:shouldHeaderBeShown(route)
                    })}
                        name= "Overview" 
                        component = {HomeTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

function shouldHeaderBeShown(route) {
    const routeName = route.state ? route.state.routes[route.state.index].name
    : 'Overview'
    switch(routeName){
        case 'Overview' : 
            return false
    }
}

function getHeaderTitle(route) {
    const routeName = route.state ? route.state.routes[route.state.index].name
    : 'Overview'

    switch (routeName) {
        case "Overview" : 
        return "Overzicht";
        case "Invoeren" : 
        return "Invoer";
    }
}

export default BillsNavigator;

