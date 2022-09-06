import React, { memo, useCallback } from "react";
import { View, StyleSheet, TouchableNativeFeedback, Text } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { setItemInfo } from "../utils/billUtils";

import SwipeableView from "./UI/SwipeableView";
import { formatDate } from "../utils/transformData";

const BillItem = ({
  item,
  activeFilters,
  selectedBills,
  handlePress,
  handlePayedPress,
  handleDeletePress,
  simultaneousHandlers,
  TouchableCmp,
}) => {
  const billSelected = selectedBills ? selectedBills.includes(item.id) : null;
  const itemInfo = setItemInfo(item);

  const formattedDateCreated = formatDate(item.dateCreated);

  const formattedDateExpired = formatDate(item.dateExpiry);

  const formattedPaymentDate = item.paymentDate && formatDate(item.paymentDate);

  const onPress = useCallback(() => {
    handlePress(item);
  }, [item, handlePress]);

  return (
    <SwipeableView
      billItem={item}
      activeFilters={activeFilters}
      onPayedPress={handlePayedPress}
      onDeletePress={handleDeletePress}
      simultaneousHandlers={simultaneousHandlers}
    >
      <TouchableCmp
        useForeground
        background={TouchableNativeFeedback.Ripple("#F3F3F3")}
        onPress={onPress}
      >
        <Card style={styles.container}>
          <Card.Title
            title={item.title}
            subtitle={formattedDateCreated}
            style={{
              backgroundColor: itemInfo.cardColor,
              marginBottom: 5,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              minHeight: 60,
              paddingRight: 16,
            }}
            titleStyle={{
              fontFamily: "montserrat-medium",
              color: "white",
              fontSize: 16,
            }}
            subtitleStyle={{
              fontFamily: "montserrat-medium",
              color: "white",
              fontSize: 10,
              lineHeight: 12,
            }}
            right={() => (
              <Text
                style={{
                  fontFamily: "montserrat-semibold",
                  color: "white",
                  fontSize: 14,
                }}
              >
                {itemInfo.headerText}
              </Text>
            )}
          />
          {
            billSelected && (
              <View style={styles.overlay} />
            ) /*selection overlay */
          }
          <Card.Content
            backgroundColor="white"
            style={{
              flexDirection: "row",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <View style={styles.cardContentItem}>
              <Title style={styles.title}>Bedrag</Title>
              <Paragraph
                style={[styles.paragraph, { color: itemInfo.textColor }]}
              >{`€${item.billAmount}`}</Paragraph>
            </View>
            <View style={styles.cardContentItem}>
              <Title style={styles.title}>Status</Title>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Paragraph
                  style={[
                    styles.paragraph,
                    {
                      color: itemInfo.textColor,
                    },
                  ]}
                >
                  {itemInfo.statusText}
                </Paragraph>
                <MaterialCommunityIcons
                  name={itemInfo.statusIcon}
                  size={16}
                  color={itemInfo.cardColor}
                  style={{
                    paddingLeft: 2,
                    paddingTop: 2,
                  }}
                />
              </View>
            </View>
            <View style={[styles.cardContentItem, { flex: 1.4 }]}>
              <Title style={styles.title}>
                {item.paymentDate !== null ? "Betaald op" : "Betalen voor"}
              </Title>
              <Paragraph
                style={[styles.paragraph, { color: itemInfo.textColor }]}
              >
                {item.paymentDate ? formattedPaymentDate : formattedDateExpired}
              </Paragraph>
            </View>
            {
              billSelected && (
                <View style={styles.overlay} />
              ) /*selection overlay */
            }
          </Card.Content>
        </Card>
      </TouchableCmp>
    </SwipeableView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(243,243,243,0.7)",
  },
  container: {
    flex: 1,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderRadius: 10,
  },
  title: {
    fontFamily: "montserrat-regular",
    color: "grey",
    fontSize: 13,
  },
  cardContentItem: {
    flex: 1,
    borderRadius: 10,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: "montserrat-medium",
  },
});

export default memo(BillItem, (prevProps, nextProps) => {
  if (nextProps.selectedBills) {
    if (
      nextProps.selectedBills.includes(nextProps.item.id) &&
      !prevProps.selectedBills.includes(nextProps.item.id)
    ) {
      return false;
    } else if (
      prevProps.selectedBills.includes(nextProps.item.id) &&
      !nextProps.selectedBills.includes(nextProps.item.id)
    ) {
      return false;
    }
    return true;
  }
  return prevProps.item !== nextProps.item;
});
