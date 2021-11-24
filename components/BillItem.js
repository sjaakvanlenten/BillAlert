import React from 'react';
import { View, StyleSheet, TouchableOpacity,  Platform, TouchableNativeFeedback } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import moment from 'moment';

const BillItem = item => {

    let TouchableCmp = TouchableOpacity;

    let daysDifference = moment.duration(moment(item.dateExpiry) - moment()).days();

    let itemInfo = {
        cardColor: Colors.primary,
        statusIcon: null,
        statusText: 'Open',
        textColor: 'black',
    }

    if(item.status === 1) {
        itemInfo.cardColor = Colors.billPayed
        itemInfo.statusIcon = "md-checkmark-circle"     
        itemInfo.statusText = 'Betaald'
    }
    else {
        if(daysDifference < 1) {
            itemInfo.cardColor = Colors.billOverdue
            itemInfo.statusIcon = "ios-alert-circle"     
            itemInfo.statusText = 'Te laat'
            itemInfo.textColor = Colors.billOverdue
        } 
        else if(daysDifference < 7) {
            itemInfo.cardColor = Colors.billUrgent
            itemInfo.statusIcon = "warning"     
            itemInfo.statusText = 'Urgent' 
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
                onPress={item.onSelectBill}
            >        
                <Card style={styles.container}>
                    <Card.Title 
                        title={item.title}
                        style={{
                            backgroundColor: itemInfo.cardColor,
                            marginBottom: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                        titleStyle={{fontFamily: 'montserrat-bold', color: 'white', fontSize: 16}}
                    />
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
                                <Ionicons 
                                    name={itemInfo.statusIcon} 
                                    size={16} color={itemInfo.cardColor} 
                                    style={{paddingLeft: 2, paddingTop: 2, }} 
                                />
                            </View>
                        </View>
                        <View style={[styles.cardContentItem, {flex: 1.4}]}>
                            <Title style={styles.title}>Vervaldatum</Title>
                            <Paragraph style={[styles.paragraph, {color: itemInfo.textColor}]}>{moment(item.dateExpiry).format('LL')}</Paragraph>
                        </View>
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
        marginHorizontal: 25,
        marginVertical: 15,
        elevation: 5,
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