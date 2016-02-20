import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import eventApp from './reducers';
import App from './components/App';

import { toggleEvent } from './actions';

let store = createStore(eventApp);
// let store = createStore(eventApp, window.STATE_FROM_SERVER);

render(
 <Provider store={store}>
     <App />
 </Provider>,
 document.getElementById('app')
)

// console.log(store.getState());

// let unsubscribe = store.subscribe(() =>  console.log(store.getState()));

// store.dispatch(toggleEvent(0));
// store.dispatch(toggleEvent(0));
// store.dispatch(toggleEvent(0));

// unsubscribe();
