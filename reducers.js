import { combineReducers } from 'redux';

import { TOGGLE_EVENT, REQUEST_LOGIN, RECEIVE_LOGIN, FAIL_LOGIN, REQUEST_EVENTS, RECEIVE_EVENTS, FAIL_TO_GET_EVENTS, REQUEST_VENUE, RECEIVE_VENUE, RECEIVE_ALL_VENUES, FAIL_TO_RECEIVE_VENUE, REQUEST_SKILLS, RECEIVE_SKILLS, FAIL_TO_GET_SKILLS, RSVPD_TO_EVENT, RSVPS_SENT } from './actions';

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
    'skillActions': {
        skills: [],
        isReceiving: false,
        receivedAt: null,
        didInvalidate: false
    }
}

function mapAttributesToEvents(event) {
    // CHANGE IT TO -5 WHEN DAYLIGHT SAVING IS OVER
    const hour = parseInt(event.attributes.startDateTime.substring(11, 13)) - 4;
    return Object.assign({}, event, {
        selected: false,
        timeObj: {
            date: event.attributes.startDateTime.substring(0, 10),
            hour: hour.toString(),
            minute: event.attributes.startDateTime.substring(14, 16),
            timestring: hour < 12 ? 'AM': 'PM'
        }
    });
}

function updateEvent(state = initialState.eventActions.events, action) {
    switch (action.type) {
    case RECEIVE_EVENTS:
        return state.map((event) => mapAttributesToEvents(event))
    case TOGGLE_EVENT:
        return [
            ...state.slice(0, action.index),
            Object.assign({}, state[action.index], {
                selected: !state[action.index].selected
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
                venue: action.json,
                venueSize: action.json.attributes.seats ? action.json.attributes.seats : 200,
                selected: false
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
    case RSVPD_TO_EVENT:
        return [
            ...state.slice(0, action.index),
            Object.assign({}, state[action.index], {
                rsvp: (state[action.index].selected) ? state[action.index].selected: state[action.index].rsvp
            }),
            ...state.slice(action.index + 1)
        ]
    default:
        return state;
    }
}

function eventActions(state = initialState.eventActions, action) {
    switch (action.type) {
    case TOGGLE_EVENT:
        return Object.assign({}, state, {
            events: updateEvent(state.events, action)
        })
    case REQUEST_EVENTS:
        return Object.assign({}, state, {
            isReceiving: true
        });
    case RECEIVE_EVENTS:
        return Object.assign({}, state, {
            isReceiving: false,
            receivedAt: action.receivedAt,
            events: updateEvent(action.json, action)
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
    case RSVPD_TO_EVENT:
        return Object.assign({}, state, {
            events: updateEvent(state.events, action)
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

function skillActions(state = initialState.skillActions, action) {
    switch (action.type) {
    case REQUEST_SKILLS:
        return Object.assign({}, state, {
            isReceiving: true,
        });
    case RECEIVE_SKILLS:
        return Object.assign({}, state, {
            isReceiving: false,
            receivedAt: Date.now(),
            skills: action.json
        });
    case FAIL_TO_GET_SKILLS:
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
    eventActions,
    skillActions
})

export default rootReducer;