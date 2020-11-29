import React from 'react';
import { Text, StyleSheet } from 'react-native';

const BillItemText = props => {
  return <Text style={styles.text}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontFamily: 'open-sans',
    paddingVertical: 5,
  }
});

export default BillItemText;