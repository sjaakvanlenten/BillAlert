import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Menu, Switch, } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import HeaderButton from './HeaderButton';

import * as filterActions from '../../store/actions/filters';

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

const FilterMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [isGreenBills, setIsGreenBills] = useState(true);
    const [isOrangeBills, setIsOrangeBills] = useState(true);
    const [isRedBills, setIsRedBills] = useState(true);

    const dispatch = useDispatch();

    return (           
        <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor= {
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title="search" iconName="filter-list" onPress={() => setShowMenu(true)} />
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
                        dispatch(filterActions.filterGreenBills())
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
                        dispatch(filterActions.filterOrangeBills())
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
                        dispatch(filterActions.filterRedBills())
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