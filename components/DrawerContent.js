import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
  } from '@react-navigation/drawer';
import {
    Drawer,
} from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const DrawerContent = (props) => {
  
    return (
        <View style={{flex: 1}}>          
            <View>
                <Drawer.Section>
                    <DrawerItem
                        icon={() => <MaterialCommunityIcons name="cog-outline" size={22} color={Colors.primary}/>}
                        label='Instellingen'
                        onPress={()=>{props.navigation.navigate('ManualInput')}}
                        labelStyle={{fontFamily: 'montserrat-medium'}}
                    />
                    <DrawerItem
                        icon={() => <MaterialCommunityIcons name="trash-can-outline" size={22} color={Colors.primary}/>}
                        label='Prullenbak'
                        onPress={()=>{props.navigation.navigate('ManualInput')}}
                        labelStyle={{fontFamily: 'montserrat-medium'}}
                    />
                </Drawer.Section>
            </View>    
        </View>
    )
}

const styles = StyleSheet.create({
});

export default DrawerContent