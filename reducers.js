import {
    combineReducers
}
from 'redux';
import {
    TOGGLE_EVENT, REQUEST_LOGIN, RECEIVE_LOGIN, FAIL_LOGIN
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
    'events': []
}

function loginActions(state = initialState.loginActions, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            {
                return Object.assign({}, state, {
                    isReceiving: true
                });
            }
        case RECEIVE_LOGIN:
            {
                return Object.assign({}, state, {
                    isReceiving: false,
                    didLogin: true,
                    person: action.json,
                    receivedAt: action.receivedAt,
                });
            }
        case FAIL_LOGIN:
            {
                return Object.assign({}, state, {
                    isReceiving: false,
                    didInvalidate: true
                });
            }
        default:
            return state;
    }
}

function events(state = initialState.events, action) {
    switch (action.type) {
        case TOGGLE_EVENT:
            {
                return [
                    ...state.slice(0, action.index),
                    Object.assign({}, state[action.index], {
                        rsvpd: !state[action.index].rsvpd
                    }),
                    ...state.slice(action.index + 1)
                ];
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    events,
    loginActions
})

export default rootReducer;