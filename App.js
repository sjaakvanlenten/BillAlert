import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Font from 'expo-font';
import  AppLoading from 'expo-app-loading';
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { Provider as PaperProvider } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/nl';
import { Animated, StyleSheet, View } from "react-native";

import { db_init, drop } from './helpers/db';
import billsReducer from './store/reducers/bills';

import BillsNavigator from './navigation/BillsNavigator';

import * as billsActions from './store/actions/bills';

SplashScreen.preventAutoHideAsync().catch(() => {});

db_init()

const rootReducer = combineReducers({
  bills: billsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

store.dispatch(billsActions.loadBills())  //load bills in store

moment.locale('nl');

export default function App() {
    return (
        <AnimatedAppLoader>
            <Provider store={store}>
                    <PaperProvider>
                        <BillsNavigator />
                    </PaperProvider>
            </Provider>
        </AnimatedAppLoader>
    );
}

function AnimatedAppLoader({ children }) {
    const [isSplashReady, setSplashReady] = useState(false);
    const image = require('./assets/splash.png');

    const startAsync = useCallback(
      () => Asset.fromModule(image).downloadAsync(),
      [image]
    );
  
    const onFinish = useCallback(() => setSplashReady(true), []);
  
    if (!isSplashReady) {
      return (
        <AppLoading
          autoHideSplash={false}
          startAsync={startAsync}
          onError={console.error}
          onFinish={onFinish}
        />
      );
    }
  
    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
  }

  const fetchFonts = () => {
    return Font.loadAsync({
      'montserrat-regular': require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
      'montserrat-bold': require('./assets/fonts/Montserrat/Montserrat-Bold.ttf'),
      'montserrat-medium': require('./assets/fonts/Montserrat/Montserrat-Medium.ttf'),
      'montserrat-semibold': require('./assets/fonts/Montserrat/Montserrat-SemiBold.ttf'),
      'montserrat-extrabold': require('./assets/fonts/Montserrat/Montserrat-ExtraBold.ttf'),
    });
  };

function AnimatedSplashScreen({ children, image }) {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  
    useEffect(() => {
      if (isAppReady) {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setAnimationComplete(true));
      }
    }, [isAppReady]);
  
    const onImageLoaded = useCallback(async () => {
      try {
        await SplashScreen.hideAsync();

        const fontAssets = fetchFonts();

        await Promise.all([fontAssets]);
      } catch (e) {
        Alert.alert('Er ging iets fout, probeer het opnieuw')
      } finally {
        setAppReady(true);
      }
    }, []);
  
    return (
      <View style={{ flex: 1 }}>
        {isAppReady && children}
        {!isSplashAnimationComplete && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Constants.manifest.splash.backgroundColor,
                opacity: animation,
              },
            ]}
          >
            <Animated.Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: Constants.manifest.splash.resizeMode || "contain",
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
  }