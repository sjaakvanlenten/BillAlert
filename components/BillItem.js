import React from 'react';
import { View, StyleSheet, TouchableOpacity,  Platform, TouchableNativeFeedback } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

import Colors from '../constants/Colors';
import moment from 'moment';

const BillItem = props => {

    let TouchableCmp = TouchableOpacity;

    let daysDifference = moment.duration(moment(props.dateExpiry) - moment()).days();

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.billItem}>
            <TouchableCmp 
                    useForeground 
                    background={TouchableNativeFeedback.Ripple('#F3F3F3')}
                    onPress={props.onSelectBill}>
                <Card>
                    <Card.Title 
                        title={props.title}
                        style={{backgroundColor: 
                            daysDifference < 1 ? Colors.billOverdue : 
                            daysDifference < 7 ? Colors.billUrgent :
                            Colors.billNormal
                            , marginBottom: 10
                        }}
                        titleStyle={{fontFamily: 'montserrat-bold', color: 'white', fontSize: 16}}
                    />
                    <Card.Content backgroundColor='white' style={{ flexDirection: 'row', }}>
                        <View style={styles.cardContentItem}>
                            <Title style={styles.title}>Bedrag</Title>
                            <Paragraph style={styles.paragraph}>{props.billAmount}</Paragraph>                     
                        </View>
                        <View style={styles.cardContentItem}>
                            <Title style={styles.title}>Status</Title>
                            {props.status === 1 ? <Paragraph style={styles.paragraph}>Betaald</Paragraph> : <Paragraph style={styles.paragraph}>Open</Paragraph>} 
                        </View>
                        <View style={[styles.cardContentItem, {flex: 1.4}]}>
                            <Title style={styles.title}>Vervaldatum</Title>
                            <Paragraph style={styles.paragraph}>{moment(props.dateExpiry).format('LL')}</Paragraph>
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
        borderRadius: 10,
        padding: 20,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
    },
    title: {
        fontFamily: 'montserrat-regular', 
        color: 'grey', 
        fontSize: 13,
    },
    cardContentItem: {
        flex: 1,       
    },
    paragraph: {
        fontSize: 14,
        fontFamily: 'montserrat-medium'
    }
});

export default BillItem;