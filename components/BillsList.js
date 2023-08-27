import React, { useCallback, useMemo, useRef } from "react";
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";

import { shouldShowBillItem } from "../utils/billUtils";
import BillItem from "./BillItem";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import useAsyncStorage from "../hooks/useAsyncStorage";
import useNotifications from "../hooks/useNotifications";
import * as billsActions from "../store/actions/bills";

import SwipeableView from "./UI/SwipeableView";

const ITEM_HEIGHT = 150;

const BillsList = ({
  listData,
  filters,
  searchQuery,
  selectBill,
  selectedBills,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listRef = useRef(null);

  const { storedNotifications, deleteStoredNotification } = useAsyncStorage();
  const { cancelScheduledNotification } = useNotifications();

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const filteredListData = useMemo(() => {
    if (filters)
      return listData.filter((bill) => shouldShowBillItem(bill, filters));
  }, [filters, listData]);

  const handlePress = useCallback(
    (item) => {
      if (item.deletionDate !== null) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        selectBill(item.id);
      } else {
        navigation.navigate("Details", {
          billId: item.id,
        });
      }
    },
    [selectBill]
  );

  const handleBillDeletion = useCallback(
    (billId) => {
      dispatch(billsActions.removeBill(billId));
      if (storedNotifications[billId]) {
        storedNotifications[billId].map((notificationId) => {
          cancelScheduledNotification(notificationId);
        });
        deleteStoredNotification(billId);
      }
    },
    [dispatch]
  );

  const handleBillPayed = useCallback(
    (billId) => {
      dispatch(billsActions.updatePaymentDate(billId));
      if (storedNotifications[billId]) {
        storedNotifications[billId].map((notificationId) => {
          cancelScheduledNotification(notificationId);
        });
        deleteStoredNotification(billId);
      }
    },
    [dispatch]
  );

  const renderBillItem = useCallback(
    ({ item }) => {
      if (item.title.toLowerCase().includes(searchQuery)) {
        return (
          <SwipeableView
            billItem={item}
            activeFilters={filters}
            onPayedPress={handleBillPayed}
            onDeletePress={handleBillDeletion}
            simultaneousHandlers={listRef}
          >
            <BillItem
              item={item}
              selectedBills={selectedBills}
              handlePress={handlePress}
              activeFilters={filters}
              TouchableCmp={TouchableCmp}
            />
          </SwipeableView>
        );
      } else return null;
    },
    [filters, searchQuery, selectedBills]
  );

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <FlashList
        ref={listRef}
        windowSize={15}
        maxToRenderPerBatch={8}
        initialNumToRender={5}
        estimatedItemSize={ITEM_HEIGHT}
        data={filters ? filteredListData : listData}
        renderItem={renderBillItem}
      />
    </View>
  );
};

export default BillsList;
