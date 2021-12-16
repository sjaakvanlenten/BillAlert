import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { BackHandler, StyleSheet, View, Dimensions } from 'react-native'
import { useFocusEffect } from '@react-navigation/core'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { Menu, Button, Portal, Dialog, Paragraph, Title } from 'react-native-paper'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'

import * as billsActions from '../../store/actions/bills';
import BillsList from '../../components/BillsList'
import CustomSearchbar from '../../components/UI/CustomSearchbar'
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors'

const deletedBillsScreen = ({navigation}) => {
    const [searchPressed, setSearchPressed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [revertDialogVisible, setRevertDialogVisible] = useState(false);
    const [selectedBills, setSelectedBills] = useState([]);

    const windowHeight = Dimensions.get('window').height;

    const dispatch = useDispatch();

    const showDeleteDialog = () => setDeleteDialogVisible(true);
    const hideDeleteDialog = () => setDeleteDialogVisible(false);

    const showRevertDialog = () => setRevertDialogVisible(true);
    const hideRevertDialog = () => setRevertDialogVisible(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const bills = useSelector(state => state.bills.bills.filter(bill => bill.deletionDate !== null), shallowEqual)

    //Delete after 30 days
    useEffect(() => {
        bills.forEach(bill => {
            if(moment(bill.deletionDate).startOf('day').diff(moment().startOf('day'), 'days') >= 30) {
                dispatch(billsActions.removeBillPermanent(bill.id))     
            }
        })
    }, [])

    const selectBill = (billId, billSelected) => {
        if(!billSelected) setSelectedBills(selectedBills => selectedBills.filter(bill => bill !== billId))
        else setSelectedBills([...selectedBills, billId])   
    }

    const setSearchPressHandler = useCallback(() => {
        setSearchPressed(searchPressed => !searchPressed)
    }, [searchPressed]);

    const searchHandler = query => {
        setSearchQuery(query.trim().toLowerCase());
    }

    const deleteHandler = (selectAll = false) => {  
        if(selectAll) {
            bills.forEach(bill => {
                dispatch(billsActions.removeBillPermanent(bill.id))       
            })
            navigation.goBack();
        } else {
            selectedBills.forEach(id => {
                dispatch(billsActions.removeBillPermanent(id)) 
            })
            setSelectedBills([])
            hideDeleteDialog();
        }
    }

    const revertHandler = () => {
        selectedBills.forEach(id => {
            dispatch(billsActions.removeBill(id, true)) //revert
        })
        setSelectedBills([])
        hideRevertDialog();
    }

    useLayoutEffect(() => {
            navigation.setOptions({
            headerTitle: !searchPressed ? 'Prullenbak' : '',
            headerRight: () => (   
                <View style={{flexDirection:'row', 
                    flex: 1, 
                    alignItems: 'center', 
                    paddingVertical: 10,
                    justifyContent: 'flex-end',
                    paddingLeft: 5,
                }}>
                    <CustomSearchbar 
                        setSearchPressHandler={setSearchPressHandler}
                        searchHandler={searchHandler}
                        searchPressed={searchPressed}
                    />
                    {selectedBills.length < 1 ? (
                        <Menu
                            visible={menuVisible}
                            onDismiss={closeMenu}
                            anchor={
                                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                                    <Item 
                                        title="delete_all" 
                                        IconComponent={MaterialCommunityIcons} 
                                        iconName="dots-vertical" 
                                        onPress={openMenu} 
                                    />
                                </HeaderButtons>
                            }
                        >
                            <Menu.Item 
                                onPress={() => {
                                    showDeleteDialog()
                                    closeMenu()                        
                                }} 
                                title="Verwijder alle Rekeningen" 
                                titleStyle={{fontFamily: 'montserrat-medium'}}
                            />
                        </Menu>
                    ) : (
                        <View style={{flexDirection: 'row'}}>
                            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                                <Item 
                                    title="revert_selection" 
                                    IconComponent={MaterialCommunityIcons} 
                                    iconName="redo-variant" 
                                    onPress={() => showRevertDialog()} 
                                />
                                </HeaderButtons>       
                                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                                <Item 
                                    title="delete_selection" 
                                    IconComponent={MaterialCommunityIcons} 
                                    iconName="trash-can-outline" 
                                    onPress={() => showDeleteDialog()} 
                                />
                            </HeaderButtons>   
                        </View>            
                    )}
                </View>                            
            ),
        });
      }, [navigation, searchPressed, searchQuery, menuVisible, selectedBills]);

    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            if (searchPressed) {
              setSearchPressed(false);
              return true;
            } else {
              return false;
            }
          };
    
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [searchPressed])
    );    

    return (
       <View style={styles.screen}>
            {bills.length < 1 ? (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{marginBottom: windowHeight*0.4, alignItems: 'center'}}>
                    <Title style={{fontFamily: 'montserrat-semibold'}}>De prullenbak is leeg</Title>
                    <MaterialCommunityIcons
                        name='delete-empty-outline' 
                        size={80} 
                        color={Colors.primary}       
                        style={{transform: [{rotate: '10deg' }] }}          
                    />
                    </View>
                </View>
            ) : (
                <View style={styles.screen}>
                    <BillsList 
                        searchQuery={searchQuery}
                        listData={bills} 
                        deletedBillsList
                        selectBill={selectBill}
                    />  
                <Portal>
                    <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
                        <Dialog.Content>
                            <Paragraph style={{fontFamily: 'montserrat-regular', fontSize: 16}}>
                                {selectedBills.length === 1 ?
                                    'Weet je zeker dat je deze rekening wil verwijderen?'
                                : selectedBills.length > 1 ?
                                    'Weet je zeker dat je deze rekeningen wil verwijderen?'
                                :
                                    'Weet je zeker dat je alle rekeningen wil verwijderen?'
                                }
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions style={{justifyContent: 'space-between', paddingHorizontal: 45}}>
                            <Button color={Colors.primary} onPress={hideDeleteDialog}>Annuleren</Button>
                            <Button 
                                color={Colors.primary} 
                                onPress={() => {
                                    selectedBills.length > 0 ?
                                        deleteHandler()
                                    :
                                        deleteHandler(true)
                                }}
                            >
                                Verwijderen
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={revertDialogVisible} onDismiss={hideRevertDialog}>
                        <Dialog.Content>
                            <Paragraph style={{fontFamily: 'montserrat-regular', fontSize: 16}}>
                                {selectedBills.length === 1 ?
                                    'Weet je zeker dat je deze rekening terug wil plaatsen?'
                                : 
                                    'Weet je zeker dat je deze rekeningen terug wil plaatsen?'
                                }
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions style={{justifyContent: 'space-between', paddingHorizontal: 45}}>
                            <Button color={Colors.primary} onPress={hideRevertDialog}>Annuleren</Button>
                            <Button 
                                color={Colors.primary} 
                                onPress={() => {
                                    revertHandler()
                                }}
                            >
                                Terugplaatsen
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        )} 
        </View>      
    )
}

export default deletedBillsScreen

const styles = StyleSheet.create({
    screen: {
        flex:1, 
        backgroundColor: 'white', 
    },
})
