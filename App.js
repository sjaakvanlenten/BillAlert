import React, { useState } from 'react';
import * as Font from 'expo-font';
import  AppLoading from 'expo-app-loading';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import moment from 'moment';

import { init, fetchBills, drop } from './helpers/db';
import billsReducer from './store/reducers/bills';
import filterReducer from './store/reducers/filters';
import BillsNavigator from './navigation/BillsNavigator';


init()
  .then(() => {
    console.log('ajaa');
  })
  .catch(err => {
    console.log('Initializing db failed.');
    console.log(err);
  });

const rootReducer = combineReducers({
  bills: billsReducer,
  filters: filterReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
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