import React, { useState, memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Menu, RadioButton } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import HeaderButton from './HeaderButton';

const SortingMenu = ({ setBillsOrder }) => {
    
    const [showMenu, setShowMenu] = useState(false);
    const [value, setValue] = useState('dateCreated_up');

    return (           
        <Menu
            style={{width: '65%'}}
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor= {
                <HeaderButtons HeaderButtonComponent={HeaderButton} >
                    <Item title="sort" IconComponent={MaterialCommunityIcons} iconName="sort" onPress={() => setShowMenu(true)} />
                </HeaderButtons>
            }
        >
            <RadioButton.Group onValueChange={newValue => {setValue(newValue); setBillsOrder(newValue)}} value={value}>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text style={styles.text}>Titel </Text>
                        <FontAwesome5 name="sort-alpha-down" size={16} color={Colors.primary} />
                    </View>                    
                    <RadioButton value="title" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text style={styles.text}>Vervaldatum </Text>
                        <FontAwesome5 name="sort-numeric-up-alt" size={16} color={Colors.primary} />
                    </View>
                    <RadioButton value="dateExpiry_up" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text style={styles.text}>Vervaldatum </Text>
                        <FontAwesome5 name="sort-numeric-down" size={16} color={Colors.primary}/>
                    </View>
                    <RadioButton value="dateExpiry_down" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text style={styles.text}>Datum aangemaakt </Text>
                        <FontAwesome5 name="sort-numeric-up-alt" size={16} color={Colors.primary} />
                    </View>
                    <RadioButton value="dateCreated_up" color={Colors.primary} />
                </View>
                <View style={styles.filterContainer}>
                    <View flexDirection='row' alignItems='center'>
                        <Text style={styles.text}>Datum aangemaakt </Text>
                        <FontAwesome5 name="sort-numeric-down" size={16} color={Colors.primary}/>
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
    filterContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      marginLeft: 10
    },
    text: {
        fontFamily: 'montserrat-medium',
        marginRight: 10,
        fontSize: 14,
    }
  });

export default memo(SortingMenu);