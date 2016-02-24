import {
    combineReducers
}
from 'redux';

import {
    TOGGLE_EVENT,
    REQUEST_LOGIN,
    RECEIVE_LOGIN,
    FAIL_LOGIN,
    REQUEST_EVENTS,
    RECEIVE_EVENTS,
    FAIL_TO_GET_EVENTS,
    REQUEST_VENUE,
    RECEIVE_VENUE,
    RECEIVE_ALL_VENUES,
    FAIL_TO_RECEIVE_VENUE
}
from './actions';

const initialState = {
    'loginActions': {
        isReceiving: false,
        didLogin: false,
        person: null,
        receivedAt: null,
        didInvalidate: false
    },
    'eventActions': {
        events: [],
        isReceiving: false,
        receivedAt: null,
        didInvalidate: false,
        receivedAllCalls: false
    },
    'venueActions': {
        venues: [],
        isReceiving: false,
        receivedAt: null,
        didInvalidate: false
    }
};

function updateEvent(state=initialState.eventActions.events, action) {
    switch (action.type) {
        case TOGGLE_EVENT:
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                    rsvpd: !state[action.index].rsvpd
                }),
                ...state.slice(action.index + 1)
            ]
        case REQUEST_VENUE:
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                    isReceiving: true
                }),
                ...state.slice(action.index + 1)
            ]
        case RECEIVE_VENUE:
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                    isReceiving: false,
                    receivedAt: Date.now(),
                    venue: action.json
                }),
                ...state.slice(action.index + 1)
            ]
        case FAIL_TO_RECEIVE_VENUE:
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                    isReceiving: false,
                    receivedAt: Date.now(),
                    didInvalidate: true
                }),
                ...state.slice(action.index + 1)
            ]
        default:
            return state;
    }
}

function eventActions(state = initialState.eventActions, action) {
    switch (action.type) {
        case REQUEST_EVENTS:
            return Object.assign({}, state, {
                isReceiving: true
            });
        case RECEIVE_EVENTS:
            return Object.assign({}, state, {
                isReceiving: false,
                receivedAt: action.receivedAt,
                events: action.json
            });
            break;
        case FAIL_TO_GET_EVENTS:
            return Object.assign({}, state, {
                isReceiving: false,
                didInvalidate: true
            });
        case REQUEST_VENUE:
            return Object.assign({}, state, {
                events: updateEvent(state.events, action)
            });
        case RECEIVE_VENUE:
            return Object.assign({}, state, {
                events: updateEvent(state.events, action)
            });
        case FAIL_TO_RECEIVE_VENUE:
            return Object.assign({}, state, {
                events: updateEvent(state.events, action)
            });
        case RECEIVE_ALL_VENUES:
            return Object.assign({}, state, {
                receivedAllCalls: true
            });
        default:
            return state;
    }
}

function loginActions(state = initialState.loginActions, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            return Object.assign({}, state, {
                isReceiving: true
            });
        case RECEIVE_LOGIN:
            return Object.assign({}, state, {
                isReceiving: false,
                didLogin: true,
                person: action.json,
                receivedAt: action.receivedAt,
            });
        case FAIL_LOGIN:
            return Object.assign({}, state, {
                isReceiving: false,
                didInvalidate: true
            });
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    loginActions,
    eventActions
})

export default rootReducer;