import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Menu, RadioButton } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { MaterialIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import HeaderButton from './HeaderButton';

const SortingMenu = props => {
    const { sortBills } = props;

    const [showMenu, setShowMenu] = useState(false);
    const [value, setValue] = useState('dateCreated_up');

    return (           
        <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor= {
                <HeaderButtons HeaderButtonComponent={HeaderButton} >
                    <Item title="sort" IconComponent={MaterialIcons} iconName="sort" onPress={() => setShowMenu(true)} />
                </HeaderButtons>
            }
        >
            <RadioButton.Group onValueChange={newValue => {setValue(newValue); sortBills(newValue)}} value={value}>
                <View style={styles.filterContainer}>
                    <Text>Titel</Text>
                    <RadioButton value="title" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text>Vervaldatum </Text>
                        <Fontisto name="arrow-up-l" size={16} color="black" />
                    </View>
                    <RadioButton value="dateExpiry_up" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text>Vervaldatum </Text>
                        <Fontisto name="arrow-down-l" size={16} color="black"/>
                    </View>
                    <RadioButton value="dateExpiry_down" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text>Datum aangemaakt </Text>
                        <Fontisto name="arrow-up-l" size={16} color="black" />
                    </View>
                    <RadioButton value="dateCreated_up" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text>Datum aangemaakt </Text>
                        <Fontisto name="arrow-down-l" size={16} color="black" />
                    </View>
                    <RadioButton value="dateCreated_down" color={Colors.primary} />
                </View>
            </RadioButton.Group>
        </Menu>      
    );
};

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontFamily: 'open-sans-bold',
      fontSize: 22,
      margin: 20,
      textAlign: 'center'
    },
    filterContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginLeft: 10
    }
  });

export default SortingMenu;