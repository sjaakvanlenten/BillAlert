import React, { useEffect, useState, useCallback, memo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Menu, Switch, Title } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import MonthList from './MonthList';
import HeaderButton from './HeaderButton';


const FilterSwitch = props => {
    return (
        <Switch
          trackColor={{ true: props.color, false: 'lightgrey' }}
          thumbColor={Platform.OS === 'android' ? props.color : ''}
          value={props.state}
          style={styles.switch}
          onValueChange={props.onChange}
        />
    );
  };

const FilterMenu = ({ filtersHandler, filterMonthHandler }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isGreenBills, setIsGreenBills] = useState(true);
    const [isOrangeBills, setIsOrangeBills] = useState(true);
    const [isRedBills, setIsRedBills] = useState(true);
    const [showPayedBills, setShowPayedBills] = useState(false);
    const [month, setMonth] = useState(null)

    const updateMonth = useCallback((month) => {
        setMonth(month);
    }, [month]) 

    useEffect(() => {  
        filterMonthHandler(month)
    }, [month]);

    return (           
        <Menu
            style={styles.menu}
            contentStyle={styles.menuContent}
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchor= {
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title="filter" IconComponent={Ionicons} iconName="options-outline" onPress={() => setShowMenu(true)} />
                </HeaderButtons>
            }
        >
            <View style={styles.filterContainer}>
                <View style={styles.filterContainerText}>
                    <Title style={{fontFamily: 'montserrat-medium', fontSize: 14, }}>Filters</Title>
                </View>
                <View style={styles.filterSwitchesContainer}>
                    <FilterSwitch
                        label="Normaal"
                        color={Colors.primary}
                        state={isGreenBills}
                        onChange={
                            newValue => {
                                setIsGreenBills(newValue)  
                                filtersHandler('filterGreen', newValue)     
                            }
                        }
                    />
                    <FilterSwitch
                        label="Urgent"
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
                        label="Te laat"
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
                        color={Colors.billPayed}
                        state={showPayedBills}
                        onChange={
                            newValue => {
                                setShowPayedBills(newValue)
                                filtersHandler('filterPayedBills', newValue)
                            }
                        }
                    />  
                </View>
            </View>  
            <View style={styles.periodFilterContainer}>
                <Title style={{fontFamily: 'montserrat-medium', fontSize: 14, }}>Selecteer Maand</Title>                            
                <MonthList                 
                    updateMonth={updateMonth}
                    month ={month}
                />               
            </View>                       
        </Menu>      
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgrey',
        height: 70,
        paddingHorizontal: 30,
    },
    filterContainerText: {       
        justifyContent: 'center',
        marginRight: 20,  
    },
    filterSwitchesContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    periodFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        height: 70,
    },
    menuContent: {
        paddingVertical: 0,
    },
    menu: {
        width: '90%', 
    },
    switch: {
        transform: Platform.OS === 'ios' ? [{rotate: '90deg' }, {scaleX: 0.7}, {scaleY: 0.7}] : [{rotate: '90deg' }],
        marginRight: 5,
    }
  });

export default memo(FilterMenu);