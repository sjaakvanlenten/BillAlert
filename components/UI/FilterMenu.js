import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Menu, Switch, } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import HeaderButton from './HeaderButton';


const FilterSwitch = props => {
    return (
      <View style={styles.filterContainer}>
        <Text>{props.label}</Text>
        <Switch
          trackColor={{ true: props.color }}
          thumbColor={Platform.OS === 'android' ? props.color : ''}
          value={props.state}
          onValueChange={props.onChange}
        />
      </View>
    );
  };

const FilterMenu = ({ filtersHandler }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isGreenBills, setIsGreenBills] = useState(true);
    const [isOrangeBills, setIsOrangeBills] = useState(true);
    const [isRedBills, setIsRedBills] = useState(true);
    const [showPayedBills, setShowPayedBills] = useState(false);

    return (           
        <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor= {
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title="filter" IconComponent={Ionicons} iconName="options-outline" onPress={() => setShowMenu(true)} />
                </HeaderButtons>
            }
        >
            <FilterSwitch
                label="Groen"
                color={Colors.billNormal}
                state={isGreenBills}
                onChange={
                    newValue => {
                        setIsGreenBills(newValue)  
                        filtersHandler('filterGreen', newValue)     
                    }
                }
            />
            <FilterSwitch
                label="Oranje"
                color={Colors.billUrgent}
                state={isOrangeBills}
                onChange={
                    newValue => {
                        setIsOrangeBills(newValue)
                        filtersHandler('filterOrange', newValue)
                    }
                }
            />
            <FilterSwitch
                label="Rood"
                color={Colors.billOverdue}
                state={isRedBills}
                onChange={
                    newValue => {
                        setIsRedBills(newValue)
                        filtersHandler('filterRed', newValue)
                    }
                }
            /> 
            <FilterSwitch
                label="Betaald"
                color={Colors.primary}
                state={showPayedBills}
                onChange={
                    newValue => {
                        setShowPayedBills(newValue)
                        filtersHandler('filterPayedBills', newValue)
                    }
                }
            />                           
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

export default FilterMenu;