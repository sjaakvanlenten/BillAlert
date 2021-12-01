import React, { useEffect, useState, useCallback, memo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Menu, Switch, Title } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import MonthList from './MonthList';
import HeaderButton from './HeaderButton';

const FilterMenu = ({ filtersHandler, filterMonthHandler, filters }) => {
    const [showMenu, setShowMenu] = useState(false);
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
                    <Switch
                        trackColor={{ true: Colors.primary, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.primary : ''}
                        value={filters.filterGreen}
                        style={styles.switch}
                        onValueChange={() => filtersHandler('filterGreen', !filters.filterGreen)}
                    />
                    <Switch
                        trackColor={{ true: Colors.billUrgent, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.billUrgent : ''}
                        value={filters.filterOrange}
                        style={styles.switch}
                        onValueChange={() => filtersHandler('filterOrange', !filters.filterOrange)}
                    />
                    <Switch
                        trackColor={{ true: Colors.billOverdue, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.billOverdue : ''}
                        value={filters.filterRed}
                        style={styles.switch}
                        onValueChange={() => filtersHandler('filterRed', !filters.filterRed)}
                    />
                    <Switch
                        trackColor={{ true: Colors.billPayed, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.billPayed : ''}
                        value={filters.filterPayedBills}
                        style={styles.switch}
                        onValueChange={() => filtersHandler('filterPayedBills', !filters.filterPayedBills)}
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
            <View style={styles.periodFilterContainer}>
                <Title style={{fontFamily: 'montserrat-medium', fontSize: 14, }}>Alleen betaalde Rekeningen</Title>                             
                    <Switch
                        trackColor={{ true: Colors.billPayed, false: 'lightgrey' }}
                        thumbColor={Platform.OS === 'android' ? Colors.billPayed : ''}
                        value={filters.filterOnlyPayed}
                        style={[styles.switch, {transform: Platform.OS === 'ios' ? [{rotate: '0deg' }, {scaleX: 0.7}, {scaleY: 0.7}] : [{rotate: '0deg' }]}]}
                        onValueChange={() => filtersHandler('filterOnlyPayed', !filters.filterOnlyPayed)}
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