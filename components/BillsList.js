import React, { useCallback, useMemo } from "react";
import { View, FlatList } from "react-native";

import { shouldShowBillItem } from "../utils/billUtils";
import BillItem from "./BillItem";

const BillsList = ({
  listData,
  filters,
  searchQuery,
  deletedBillsList,
  selectBill,
  selectedBills,
}) => {

  const filteredData = useMemo(() => {
    if (deletedBillsList) return;

    return listData.filter((bill) => shouldShowBillItem(bill, filters));
  }, [filters, listData]);

  const renderBillItem = useCallback(
    ({ item }) => {
      if (item.title.toLowerCase().includes(searchQuery)) {
        if (deletedBillsList) {
          return (
            <BillItem
              item={item}
              selectBill={selectBill}
              selectedBills={selectedBills}
            />
          );
        }
        return <BillItem item={item} />;
      } else return null;
    },
    [filters, searchQuery, selectedBills]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);
  
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <FlatList
        windowSize={15}
        maxToRenderPerBatch={8}
        initialNumToRender={5}
        data={deletedBillsList ? listData : filteredData}
        keyExtractor={keyExtractor}
        renderItem={renderBillItem}
      />
    </View>
  );
};

export default BillsList;