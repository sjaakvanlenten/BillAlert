import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity,  Platform, TouchableNativeFeedback, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Colors from '../constants/Colors';
import moment from 'moment';

const BillItem = ({item, selectBill}) => {
    const navigation = useNavigation()
    const [billSelected, setBillSelected] = useState(false);

    let TouchableCmp = TouchableOpacity;

    const daysDifference = moment(item.dateExpiry).startOf('day').diff(moment().startOf('day'), 'days')

    const itemInfo = { //Normal Bill
        cardColor: Colors.primary,
        statusIcon: null, 
        statusText: 'Open',
        textColor: 'black',
        headerText : `Nog ${daysDifference} dagen`,
    }
    if(item.deletionDate !== null){
        itemInfo.cardColor = '#464646'
        itemInfo.statusIcon = null    
        itemInfo.statusText = ''
        itemInfo.headerText = ''
    }
    if(item.paymentDate !== null && item.deletionDate === null ) { //Payed Bill
        itemInfo.cardColor = Colors.billPayed
        itemInfo.statusIcon = "check-circle"     
        itemInfo.statusText = 'Betaald'
        itemInfo.headerText = 'Betaald'
    }
    if(item.deletionDate === null && item.paymentDate === null) {
        if(daysDifference <= 0) { //Bill Overdue
            itemInfo.cardColor = Colors.billOverdue
            itemInfo.statusIcon = "alarm-light"    
            itemInfo.statusText = 'Te laat'
            itemInfo.textColor = Colors.billOverdue,
            itemInfo.headerText = `${(daysDifference*-1)+1} ${daysDifference == 0 ? 'dag' : 'dagen'} te laat!`
        } 
        else if(daysDifference < 7) { //Urgent Bill
            itemInfo.cardColor = Colors.billUrgent
            itemInfo.statusIcon = "alert"     
            itemInfo.statusText = 'Urgent' 
            if(daysDifference == 1) itemInfo.headerText= 'Laatste dag!'
        }
    }

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.billItem}>
            <TouchableCmp 
                useForeground 
                background={TouchableNativeFeedback.Ripple('#F3F3F3')}
                onPress={() => {
                    if(item.deletionDate !== null) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) 
                        selectBill(item.id, !billSelected);
                        setBillSelected(billSelected => !billSelected);
                    } else {
                        navigation.navigate( 'Details', {
                            billId: item.id,
                            itemInfo: itemInfo,
                            }
                        )
                    }
                }}
            >                 
                <Card style={styles.container}>
                    <Card.Title 
                        title={item.title}  
                        subtitle={moment(item.dateCreated).format('LL')}
                        style={{
                            backgroundColor: itemInfo.cardColor,
                            marginBottom: 5,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            minHeight: 60,
                            paddingRight: 16,
                        }}
                        titleStyle={{fontFamily: 'montserrat-medium', color: 'white', fontSize: 16}}
                        subtitleStyle={{fontFamily: 'montserrat-medium', color: 'white', fontSize: 10,  lineHeight: 12}}
                        right={() => (    
                                <Text
                                    style={{
                                        fontFamily: 'montserrat-semibold',
                                        color: 'white',
                                        fontSize: 14,
                                    }}
                                >
                                    {itemInfo.headerText}
                                </Text> 
                        )}
                    />
                    { billSelected && <View style={styles.overlay} /> /*selection overlay */ }
                    <Card.Content 
                        backgroundColor='white' 
                        style={{ 
                            flexDirection: 'row', 
                            borderBottomLeftRadius: 10, 
                            borderBottomRightRadius: 10
                        }}
                        >
                        <View style={styles.cardContentItem}>
                            <Title style={styles.title}>Bedrag</Title>
                            <Paragraph style={[styles.paragraph, {color: itemInfo.textColor}]}>{`€${item.billAmount}`}</Paragraph>                     
                        </View>
                        <View style={styles.cardContentItem}>
                            <Title style={styles.title}>Status</Title>
                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Paragraph style={[styles.paragraph, {color: itemInfo.textColor}]}>{itemInfo.statusText}</Paragraph> 
                                <MaterialCommunityIcons
                                    name={itemInfo.statusIcon} 
                                    size={16} color={itemInfo.cardColor} 
                                    style={{paddingLeft: 2, paddingTop: 2, }} 
                                />
                            </View>
                        </View>
                        <View style={[styles.cardContentItem, {flex: 1.4}]}>
                            <Title style={styles.title}>
                                {item.paymentDate !== null ? 'Betaald op' : 'Betalen voor'} 
                            </Title>
                            <Paragraph style={[styles.paragraph, {color: itemInfo.textColor}]}>
                                {item.paymentDate !== null 
                                    ? moment(item.paymentDate).format('LL')
                                    : moment(item.dateExpiry).format('LL')
                                }
                            </Paragraph>
                        </View>
                        {billSelected && <View style={styles.overlay} /> /*selection overlay */ } 
                    </Card.Content>          
                </Card>
            </TouchableCmp>         
        </View>     
    );
}

const styles = StyleSheet.create({
    billItem: {     
        flex: 1,   
        borderRadius: 10,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        marginHorizontal: Platform.OS === 'android' ? 20 : 10,
        marginVertical: 15,
        elevation: 5,
    },
    overlay: {   
        ...StyleSheet.absoluteFillObject,     
        backgroundColor: 'rgba(243,243,243,0.7)',
      },
    container: {  
        flex: 1,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        borderRadius: 10,
    },
    title: {
        fontFamily: 'montserrat-regular', 
        color: 'grey', 
        fontSize: 13,
    },
    cardContentItem: {
        flex: 1,   
        borderRadius: 10,    
    },
    paragraph: {
        fontSize: 14,
        fontFamily: 'montserrat-medium',
    }
});

export default BillItem;