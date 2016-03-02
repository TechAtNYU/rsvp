import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import App from './components/App';
import { toggleEvent, fetchPerson, fetchEvents, fetchVenue, receivedAllVenues, fetchSkills } from './actions';

const loggerMiddleware = createLogger();

let store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

let unsubscribe = store.subscribe(() => console.log(store.getState()));
render(
    <Provider store={store}>
	<App />
	</Provider>,
    document.getElementById('app')
);

store.dispatch(fetchPerson()).then(() => store.dispatch(fetchEvents())
    .then(() => Promise.all(
        store.getState().eventActions.events.map((event, i) => store.dispatch(fetchVenue(event.relationships.venue.data.id, i))))
        .then(() => store.dispatch(fetchSkills())
    // .then(() => render(
    // 		<Provider store={store}>
    // 		<App />
    // 		</Provider>,
    // 		document.getElementById('app')
    // 		)
    // )
    )
))


unsubscribe();