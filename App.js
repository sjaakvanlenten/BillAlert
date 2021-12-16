import React, { useState } from 'react';
import * as Font from 'expo-font';
import  AppLoading from 'expo-app-loading';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { Provider as PaperProvider } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/nl';

import { init, drop } from './helpers/db';
import billsReducer from './store/reducers/bills';

import BillsNavigator from './navigation/BillsNavigator';

import * as billsActions from './store/actions/bills';
// import {allowsNotificationsAsync, triggerNotificationHandler} from './helpers/Notifications';
// import * as Notifications from 'expo-notifications';

init()
  .then(() => {
    
  })
  .catch(err => {
    console.log('Initializing db failed.');
    console.log(err);
  });

const rootReducer = combineReducers({
  bills: billsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

store.dispatch(billsActions.loadBills())

const fetchFonts = () => {
  return Font.loadAsync({
    'montserrat-regular': require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
    'montserrat-bold': require('./assets/fonts/Montserrat/Montserrat-Bold.ttf'),
    'montserrat-medium': require('./assets/fonts/Montserrat/Montserrat-Medium.ttf'),
    'montserrat-semibold': require('./assets/fonts/Montserrat/Montserrat-SemiBold.ttf'),
    'montserrat-extrabold': require('./assets/fonts/Montserrat/Montserrat-ExtraBold.ttf'),
  });
};


moment.locale('nl');

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
            <PaperProvider>
                <BillsNavigator />
            </PaperProvider>
    </Provider>
  );
}