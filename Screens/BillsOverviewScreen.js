import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useHeaderHeight } from "@react-navigation/elements";
import { connect, useDispatch } from "react-redux";
import { FAB, Snackbar } from "react-native-paper";
import moment from "moment";

import * as billsActions from "../store/actions/bills";
import useNotifications from "../hooks/useNotifications";

import FilterMenu from "../components/UI/FilterMenu";
import SortingMenu from "../components/UI/SortingMenu";
import BillsList from "../components/BillsList";
import InfoBar from "../components/InfoBar";
import CustomSearchbar from "../components/UI/CustomSearchbar";
import { sortData } from "../utils/transformData";
import Colors from "../constants/Colors";

const BillsOverviewScreen = ({ bills, navigation, route }) => {
  const { scheduleNotifications } = useNotifications();
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();

  const [availableBills, setAvailableBills] = useState([]);
  const [filters, setFilters] = useState({
    filterGreen: true,
    filterOrange: true,
    filterRed: true,
    filterPayedBills: false,
    filterOnlyPayed: false,
  });
  const [monthFilter, setMonthFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackBarVisible, setSnackbarVisible] = useState(false);

  const showSnackBar = () => setSnackbarVisible(true);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  /*Show snackbar when bill is deleted */
  useEffect(() => {
    if (route.params?.billId) {
      showSnackBar();
    }
  }, [route.params]);

  /* Set local state when redux store changes and check for month filter*/
  useEffect(() => {
    if (monthFilter !== null) {
      setAvailableBills(
        bills.filter(
          (bill) =>
            moment(bill.dateExpiry).format("MMMM") ==
            monthFilter.charAt(0).toLowerCase() + monthFilter.slice(1)
        )
      );
    } else {
      setAvailableBills(sortData(bills, "dateCreated_up"));
    }
  }, [bills, monthFilter]);

  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            paddingVertical: 10,
            justifyContent: "flex-end",
            paddingLeft: 5,
          }}
        >
          <CustomSearchbar
            searchQuery={searchQuery}
            searchHandler={searchHandler}
            onSearchPress={searchPressHandler}
            headerHeight={headerHeight}
          />
          <SortingMenu setBillsOrder={setBillsOrder} />
          <FilterMenu
            filtersHandler={filtersHandler}
            filterMonthHandler={filterMonthHandler}
            filters={filters}
          />
        </View>
      ),
    });
  }, [navigation, filters, searchQuery]);

  const searchHandler = (query) => {
    setSearchQuery(query.trim().toLowerCase());
  };

  const searchPressHandler = useCallback(
    (searchPressed) => {
      navigation.getParent().setOptions({
        headerTitle: searchPressed ? "" : "Rekeningen",

        headerTitleContainerStyle: {
          marginHorizontal: searchPressed ? 0 : 10,
        },
      });
    },
    [navigation]
  );

  /* Setting the order of the bills for the listData from SortingMenu */
  const setBillsOrder = useCallback(
    (sortBy) => {
      setAvailableBills((availableBills) => sortData(availableBills, sortBy));
    },
    [availableBills]
  );

  /* Setting the filters for the listData from FilterMenu */
  const filtersHandler = useCallback(
    (filter, value) => {
      if (filter === "filterOnlyPayed") {
        setFilters((filters) => ({
          ...filters,
          ["filterGreen"]: !value,
          ["filterOrange"]: !value,
          ["filterRed"]: !value,
          ["filterPayedBills"]: value,
          ["filterOnlyPayed"]: value,
        }));
      } else {
        setFilters((filters) => ({
          ...filters,
          [filter]: value,
          ["filterOnlyPayed"]: false,
        }));
      }
    },
    [filters]
  );

  /* Setting the available bills filtered by month */
  const filterMonthHandler = useCallback(
    (month) => {
      month === "Alle Maanden" ? setMonthFilter(null) : setMonthFilter(month);
    },
    [monthFilter]
  );

  /* Calculating and storing the total billAmount */
  const totalBillAmount = useMemo(() => {
    return availableBills.reduce((total, bill) => {
      if (bill.paymentDate !== null) {
        return total;
      } else {
        return total + parseFloat(bill.billAmount);
      }
    }, 0);
  }, [availableBills]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <InfoBar
        totalBillAmount={totalBillAmount}
        openBillsAmount={
          availableBills.filter((bill) => bill.paymentDate === null).length
        }
      />
      <BillsList
        listData={availableBills}
        filters={filters}
        searchQuery={searchQuery}
      />
      <FAB
        style={{
          position: "absolute",
          margin: 24,
          right: 0,
          bottom: snackBarVisible ? 62 : 0,
          backgroundColor: Colors.primary,
          borderRadius: 64 / 2,
        }}
        icon="plus"
        color="white"
        customSize={64}
        onPress={() => navigation.navigate("ManualInput")}
      />
      <Snackbar
        style={{ backgroundColor: "#464646" }}
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        action={{
          label: "Ongedaan maken",
          onPress: () => {
            dispatch(billsActions.removeBill(route.params?.billId, true));
            scheduleNotifications(
              route.params?.billId,
              route.params?.dateExpiry,
              route.params?.title
            );
          },
        }}
      >
        {`"${route.params?.title}" is naar de prullenbak verplaatst.`}
      </Snackbar>
      {Platform.OS === "ios" && <StatusBar style="light" />}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    bills: state.bills.bills.filter((bill) => bill.deletionDate === null),
  };
};
export default connect(mapStateToProps)(BillsOverviewScreen);
