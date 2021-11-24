import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Menu, Button, Divider } from 'react-native-paper';

import Colors from '../../constants/Colors'

const MonthList = ({ updateMonth, month }) => {
    const [visible, setVisible] = useState(false);
    
    const openMenu = () => setVisible(true);
  
    const closeMenu = () => setVisible(false);

    const monthsArray = [
        "Januari",
        "Februari",
        "Maart",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Augustus",
        "September",
        "Oktober",
        "November",
        "December"
    ]

    return (
        <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
            <Button 
                icon='chevron-down'
                onPress={openMenu}
                mode='outlined'             
                color='black'
                uppercase={false}
                labelStyle={{fontSize: 12, fontFamily:'montserrat-medium'}}
                style={{width: 145, borderColor: Colors.primary, borderWidth:1}}
                contentStyle={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}
            >
                {month === null ? "Alle Maanden" : month}
            </Button>
        }
        style={{height: 200}}
    >
        <ScrollView>
            <Menu.Item 
                onPress={() => {
                    updateMonth("Alle Maanden")        
                    closeMenu();
                 }} 
                 title="Alle Maanden" 
            />
            <Divider />
            {monthsArray.map((item, i) => (
                <Menu.Item 
                    key={i}
                    onPress={() => {
                        updateMonth(item)
                        closeMenu();
                    }} 
                    title={item} 
                />
            ))}
        </ScrollView>
    </Menu>
    )
}

export default MonthList

