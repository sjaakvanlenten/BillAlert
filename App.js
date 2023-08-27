import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { Provider as PaperProvider } from "react-native-paper";
import moment from "moment";
import "moment/locale/nl";
import { Animated, StyleSheet, View, Alert } from "react-native";

import { db_init } from "./utils/db";
import billsReducer from "./store/reducers/bills";

import BillsNavigator from "./navigation/BillsNavigator";

import * as billsActions from "./store/actions/bills";

import Constants from "expo-constants";
import { Text } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

db_init();

const rootReducer = combineReducers({
  bills: billsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

store.dispatch(billsActions.loadBills()); // Load bills in store

moment.locale("nl");

const fetchFonts = async () => {
  return Font.loadAsync({
    "montserrat-regular": require("./assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    "montserrat-medium": require("./assets/fonts/Montserrat/Montserrat-Medium.ttf"),
    "montserrat-semibold": require("./assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    "montserrat-extrabold": require("./assets/fonts/Montserrat/Montserrat-ExtraBold.ttf"),
  });
};

export default function App() {
  const [isSplashReady, setSplashReady] = useState(false);
  const [isAppReady, setAppReady] = useState(false);
  const image = require("./assets/splash.png");

  const startAsync = useCallback(async () => {
    try {
      const fontAssets = fetchFonts();
      await Promise.all([fontAssets]);
    } catch (e) {
      Alert.alert("Er ging iets fout, probeer het opnieuw");
    } finally {
      setAppReady(true);
    }
  }, [image]);

  const AnimatedSplashScreen = () => {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

    const onImageLoaded = useCallback(async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        Alert.alert("Er ging iets fout, probeer het opnieuw");
      } finally {
        setSplashReady(true);
      }
    }, []);

    useEffect(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }, [animation]);

    return (
      <View style={{ flex: 1 }}>
        {!isSplashAnimationComplete && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: "white", // Change the background color if needed
                opacity: animation,
              },
            ]}
          >
            <Animated.Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain", // Adjust resizeMode as needed
                transform: [
                  {
                    scale: animation,
                  },
                ],
              }}
              source={image}
              onLoadEnd={onImageLoaded}
              fadeDuration={0}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  useEffect(() => {
    startAsync();
  }, [startAsync]);

  if (!isAppReady || !isSplashReady) {
    return <AnimatedSplashScreen />;
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <BillsNavigator />
      </PaperProvider>
    </Provider>
  );
}
