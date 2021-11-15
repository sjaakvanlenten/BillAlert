import React, { useState } from 'react';
import * as Font from 'expo-font';
import  AppLoading from 'expo-app-loading';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import moment from 'moment';
import 'moment/locale/nl';

import { init, fetchBills, drop } from './helpers/db';
import billsReducer from './store/reducers/bills';

import BillsNavigator from './navigation/BillsNavigator';

import * as billsActions from './store/actions/bills';


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
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'open-sans-semibold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'open-sans-medium': require('./assets/fonts/OpenSans-Medium.ttf'),
    'open-sans-light': require('./assets/fonts/OpenSans-Light.ttf'),
    'open-sans-extrabold': require('./assets/fonts/OpenSans-ExtraBold.ttf'),
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
        <BillsNavigator />
    </Provider>
  );
}