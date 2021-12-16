import React from 'react'
import { StyleSheet, View } from 'react-native'
import { DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DrawerContent = ({navigation}) => {
    return (
        <View>          
            <Drawer.Section>
                <DrawerItem
                    icon={() => <MaterialCommunityIcons 
                        name="cog-outline" 
                        size={22} 
                        color='white'
                    />}
                    label='Instellingen'
                    onPress={()=> {
                        navigation.closeDrawer();
                        navigation.navigate('Settings');
                    }}
                    labelStyle={{
                        fontFamily: 'montserrat-medium',
                        color: 'white'
                    }}
                />
                <DrawerItem
                    icon={() => <MaterialCommunityIcons 
                        name="trash-can-outline" 
                        size={22} 
                        color='white'
                    />}
                    label='Prullenbak'
                    onPress={()=>{
                        navigation.closeDrawer();
                        navigation.navigate('Trash');
                    }}
                    labelStyle={{
                        fontFamily: 'montserrat-medium',
                        color: 'white'
                    }}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
});

export default DrawerContent