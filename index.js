import React from 'react';
import {
	render
}
from 'react-dom';
import {
	Provider
}
from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {
	createStore, applyMiddleware
}
from 'redux';
import rootReducer from './reducers';
import App from './components/App';
import {
	toggleEvent,
	fetchPerson,
	fetchEvents,
	fetchVenues,
	doEverything
}
from './actions';

const loggerMiddleware = createLogger();

let store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
);
// let store = createStore(eventApp, window.STATE_FROM_SERVER);

// render(
//  <Provider store={store}>
//      <App />
//  </Provider>,
//  document.getElementById('app')
// )

let unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(doEverything()).then(() => console.log("done"));

unsubscribe();