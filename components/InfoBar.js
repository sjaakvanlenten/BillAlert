import React, { memo } from 'react'
import Colors from '../constants/Colors'
import { StyleSheet, Text, View } from 'react-native'

const InfoBar = ({ openBillsAmount, totalBillAmount }) => {
    return (
        <View style={styles.infoBar}>              
            <View style={styles.main}>
                <View style={styles.left} />
                
                <Text style={styles.text}>{`Openstaande: ${openBillsAmount}`}</Text>
                <Text style={styles.text}>{`Totaal: €${totalBillAmount.toFixed(2)}`}</Text>

                <View style={styles.right} />
            </View>              
        </View>   
    )
}

const styles = StyleSheet.create({
    infoBar: {
        height: 30,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    left: {
        zIndex: -1,
        left: -35,
        bottom: 14,
        position: 'absolute',
        height: 30,
        width: 70,
        borderRadius: 50,
        backgroundColor: Colors.primaryTint,
        transform:  [{rotate: '45deg' }]
    },
    right: {
        zIndex: -1,
        right: -35,
        bottom: 14,
        position: 'absolute',
        height: 30,
        width: 70,
        borderRadius: 50,
        backgroundColor: Colors.primaryTint,
        transform:  [{rotate: '135deg' }]
    },
    main: {
        position:'relative',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: Colors.primaryTint,
    },
    text: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'montserrat-medium'     
    }
});

export default memo(InfoBar)