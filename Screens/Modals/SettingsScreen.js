import React, {
  useReducer,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { StyleSheet, View, Platform, BackHandler } from "react-native";
import * as Battery from "expo-battery";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Button,
  Portal,
  Dialog,
  Paragraph,
  Divider,
  Headline,
  Subheading,
  Switch,
  Title,
} from "react-native-paper";
import { HeaderBackButton } from "@react-navigation/elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import moment from "moment";
import _ from "lodash";

import useAsyncStorage from "../../hooks/useAsyncStorage";
import useNotifications from "../../hooks/useNotifications";
import Colors from "../../constants/Colors";
import { openSettings } from "expo-linking";

const ENABLE_NOTIFICATION = "ENABLE_NOTIFICATION";
const WHEN_START_NOTIFICATION = "WHEN_START_NOTIFICATION";
const REPEAT_NOTIFICATION = "REPEAT_NOTIFICATION";
const SET_NOTIFICATION_TIME = "SET_NOTIFICATION_TIME";

const settingsReducer = (state, action) => {
  switch (action.type) {
    case ENABLE_NOTIFICATION:
      return {
        ...state,
        push_notifications: {
          ...state.push_notifications,
          isEnabled: !state.push_notifications.isEnabled,
        },
      };
    case WHEN_START_NOTIFICATION:
      return {
        ...state,
        push_notifications: {
          ...state.push_notifications,
          daysBeforeFirstNotification: action.value,
        },
      };
    case REPEAT_NOTIFICATION:
      return {
        ...state,
        push_notifications: {
          ...state.push_notifications,
          repeatNotification: action.value,
        },
      };
    case SET_NOTIFICATION_TIME:
      return {
        ...state,
        push_notifications: {
          ...state.push_notifications,
          notificationTime: action.value,
        },
      };
    default:
      return state;
  }
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { settings, storeSettings } = useAsyncStorage();
  const [timePicker, setTimePicker] = useState(false);
  const [showBatteryAlertDialog, setShowBatteryAlertDialog] = useState(false);
  const { cancelAllScheduledNotifications, scheduleNotifications } =
    useNotifications();
  const [notificationsDialogVisible, setNotificationsDialogVisible] =
    useState(false);
  const [IosTimePickerVisible, setIosTimePickerVisible] = useState(false);
  const openBills = useSelector((state) =>
    state.bills.bills.filter(
      (bill) => bill.deletionDate === null && bill.paymentDate === null
    )
  );

  const initialState = {
    push_notifications: {
      isEnabled: settings.push_notifications.isEnabled,
      daysBeforeFirstNotification:
        settings.push_notifications.daysBeforeFirstNotification,
      repeatNotification: settings.push_notifications.repeatNotification,
      notificationTime: settings.push_notifications.notificationTime,
    },
  };

  const [settingsState, dispatch] = useReducer(settingsReducer, initialState);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        submitSettings();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [settingsState])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => {
        return <HeaderBackButton {...props} onPress={() => submitSettings()} />;
      },
    });
  }, [navigation, settingsState]);

  const timeChangeHandler = (event, selectedTime) => {
    const currentTime =
      selectedTime || settingsState.push_notifications.notificationTime;
    setTimePicker(false);
    dispatch({ type: SET_NOTIFICATION_TIME, value: currentTime });
  };

  const showTimePicker = () => {
    setTimePicker(true);
  };

  const showNotificationsDialog = () => setNotificationsDialogVisible(true);

  const hideNotificationsDialog = () => setNotificationsDialogVisible(false);

  const showIosTimePicker = () => setIosTimePickerVisible(true);

  const hideIosTimePicker = () => setIosTimePickerVisible(false);

  const notificationsToggleSwitch = () => {
    if (settingsState.push_notifications.isEnabled) {
      showNotificationsDialog();
    } else {
      dispatch({ type: ENABLE_NOTIFICATION });
      Battery.isBatteryOptimizationEnabledAsync().then(
        (isBatteryOptimizationEnabled) => {
          if (isBatteryOptimizationEnabled) setShowBatteryAlertDialog(true);
        }
      );
    }
  };

  const submitSettings = () => {
    if (!_.isEqual(settingsState, settings)) {
      if (
        !_.isEqual(
          settingsState.push_notifications.isEnabled,
          settings.push_notifications.isEnabled
        )
      ) {
        if (!settingsState.push_notifications.isEnabled) {
          cancelAllScheduledNotifications();
        } else {
          openBills.map((bill) => {
            scheduleNotifications(bill.id, bill.dateExpiry, bill.title);
          });
        }
      }
      storeSettings(settingsState);
      cancelAllScheduledNotifications();
      openBills.map((bill) => {
        scheduleNotifications(bill.id, bill.dateExpiry, bill.title);
      });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.mainSetting}>
          <Title style={styles.title}>Pushmeldingen</Title>
          <Switch
            trackColor={{ true: Colors.primary, false: "lightgrey" }}
            thumbColor={Platform.OS === "android" ? Colors.primary : ""}
            value={settingsState.push_notifications.isEnabled}
            onValueChange={notificationsToggleSwitch}
            style={styles.switch}
          />
        </View>
        <Divider />
        <View style={{ paddingLeft: 20, paddingTop: 15 }}>
          <Subheading
            style={[
              styles.subHeading,
              {
                color: settingsState.push_notifications.isEnabled
                  ? "black"
                  : "#b7b7be",
              },
            ]}
          >
            Aantal dagen van tevoren melden:
          </Subheading>
          <Headline
            style={[
              styles.headLine,
              {
                color: settingsState.push_notifications.isEnabled
                  ? Colors.primary
                  : "#b7b7be",
              },
            ]}
          >
            {settingsState.push_notifications.daysBeforeFirstNotification}
          </Headline>
          <Slider
            style={{ width: 300, height: 40, marginLeft: -15 }}
            minimumValue={1}
            maximumValue={14}
            value={settings.push_notifications.daysBeforeFirstNotification}
            step={1}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#b7b7be"
            thumbTintColor={
              settingsState.push_notifications.isEnabled
                ? Colors.primary
                : "#b7b7be"
            }
            onValueChange={(val) =>
              dispatch({ type: WHEN_START_NOTIFICATION, value: val })
            }
            disabled={!settingsState.push_notifications.isEnabled}
          />
        </View>
        <View style={{ paddingLeft: 20, paddingTop: 15 }}>
          <Subheading
            style={[
              styles.subHeading,
              {
                color: settingsState.push_notifications.isEnabled
                  ? "black"
                  : "#b7b7be",
              },
            ]}
          >
            Herhalen:
          </Subheading>
          <Headline
            style={[
              styles.headLine,
              {
                color: settingsState.push_notifications.isEnabled
                  ? Colors.primary
                  : "#b7b7be",
              },
            ]}
          >
            {settingsState.push_notifications.repeatNotification == 1
              ? "Dagelijks"
              : settingsState.push_notifications.repeatNotification >= 7
              ? "Wekelijks"
              : `Elke ${settingsState.push_notifications.repeatNotification} dagen`}
          </Headline>
          <Slider
            style={{ width: 300, height: 40, marginLeft: -15 }}
            minimumValue={1}
            maximumValue={7}
            value={
              -Math.abs(settings.push_notifications.repeatNotification - 1) + 7
            }
            step={1}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor="#b7b7be"
            thumbTintColor={
              settingsState.push_notifications.isEnabled
                ? Colors.primary
                : "#b7b7be"
            }
            onValueChange={(val) =>
              dispatch({
                type: REPEAT_NOTIFICATION,
                value: Math.abs(val - 7) + 1,
              })
            }
            disabled={!settingsState.push_notifications.isEnabled}
          />
        </View>
        <View
          style={{ flexDirection: "row", paddingLeft: 20, paddingVertical: 15 }}
        >
          <Button
            mode="contained"
            disabled={!settingsState.push_notifications.isEnabled}
            buttonColor={Colors.primary}
            style={{ borderRadius: 50, marginRight: 40 }}
            uppercase={false}
            labelStyle={{ fontSize: 14, fontFamily: "montserrat-semibold" }}
            onPress={Platform.OS === "ios" ? showIosTimePicker : showTimePicker}
          >
            Kies een tijd
          </Button>
          <Headline
            style={[
              styles.headLine,
              {
                color: settingsState.push_notifications.isEnabled
                  ? Colors.primary
                  : "#b7b7be",
              },
            ]}
          >
            {moment(settingsState.push_notifications.notificationTime)
              .format("LT")
              .split(":")
              .join(" : ")}
          </Headline>
        </View>
        <Divider />
        <View>
          {timePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={
                new Date(settingsState.push_notifications.notificationTime)
              }
              mode="time"
              is24Hour={true}
              display="default"
              onChange={timeChangeHandler}
            />
          )}
        </View>
      </View>
      <Portal>
        <Dialog
          visible={notificationsDialogVisible}
          onDismiss={hideNotificationsDialog}
        >
          <Dialog.Content>
            <Paragraph
              style={{ fontFamily: "montserrat-regular", fontSize: 16 }}
            >
              Weet zeker dat je meldingen wilt uitschakelen?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions
            style={{ justifyContent: "space-between", paddingHorizontal: 45 }}
          >
            <Button
              textColor={Colors.primary}
              onPress={() => hideNotificationsDialog()}
            >
              Annuleren
            </Button>
            <Button
              textColor={Colors.primary}
              onPress={() => {
                dispatch({ type: ENABLE_NOTIFICATION });
                hideNotificationsDialog();
              }}
            >
              Uitschakelen
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={IosTimePickerVisible} onDismiss={hideIosTimePicker}>
          <Dialog.Content>
            <DateTimePicker
              testID="dateTimePicker"
              value={
                new Date(settingsState.push_notifications.notificationTime)
              }
              mode="time"
              is24Hour={true}
              display="spinner"
              textColor={Colors.primary}
              onChange={timeChangeHandler}
            />
          </Dialog.Content>
          <Dialog.Actions
            style={{ justifyContent: "space-between", paddingHorizontal: 45 }}
          >
            <Button
              buttonColor={Colors.primary}
              onPress={() => {
                dispatch({
                  type: SET_NOTIFICATION_TIME,
                  value: settings.push_notifications.notificationTime,
                });
                hideIosTimePicker();
              }}
            >
              Annuleren
            </Button>
            <Button
              buttonColor={Colors.primary}
              onPress={() => {
                hideIosTimePicker();
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={showBatteryAlertDialog}
          onDismiss={() => setShowBatteryAlertDialog(false)}
        >
          <Dialog.Content>
            <Paragraph
              style={{ fontFamily: "montserrat-regular", fontSize: 16 }}
            >
              Schakel batterijoptimalisatie uit voor optimale meldingen.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions
            style={{
              justifyContent: "center",
              paddingHorizontal: 45,
            }}
          >
            <Button
              textColor={Colors.primary}
              onPress={() => {
                openSettings();
                setShowBatteryAlertDialog(false);
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    width: "85%",
  },
  mainSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingOptionsContainer: {
    paddingHorizontal: 10,
  },
  settingOption: {
    marginTop: 10,
  },
  switch: {
    transform:
      Platform.OS === "ios"
        ? [{ scaleX: 0.8 }, { scaleY: 0.8 }]
        : [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  title: {
    fontFamily: "montserrat-semibold",
    fontSize: 18,
    color: Colors.primary,
  },
  subHeading: {
    fontFamily: "montserrat-semibold",
    fontSize: 14,
  },
  headLine: {
    fontFamily: "montserrat-semibold",
    fontSize: 20,
  },
  paragraph: {
    fontFamily: "montserrat-medium",
    fontSize: 14,
  },
});

export default SettingsScreen;
