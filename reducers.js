import { combineReducers } from 'redux';

import {
    TOGGLE_PROFILE_VIEW,
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
    FAIL_TO_RECEIVE_VENUE,
    REQUEST_SKILLS,
    RECEIVE_SKILLS,
    FAIL_TO_GET_SKILLS,
    RSVPD_TO_EVENT,
    RSVPS_SENT,
    UPDATE_NNUMBER,
    UPDATE_EMAIL,
    SEND_PERSON,
} from './actions';

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
    },
    'viewActions': {
        isProfileView: false
    }
}

function mapAttributesToEvents(event) {
    // CHANGE IT TO -5 WHEN DAYLIGHT SAVING IS OVER, -4 WHEN DAYLIGHT SAVING IS GOING ON
    let hour = parseInt(event.attributes.startDateTime.substring(11, 13)) - 4;
    const timestring = hour < 12 ? 'AM': 'PM';
    if (hour > 12) hour -= 12;
    return Object.assign({}, event, {
        selected: false,
        timeObj: {
            date: event.attributes.startDateTime.substring(0, 10),
            hour: hour.toString(),
            minute: event.attributes.startDateTime.substring(14, 16),
            timestring: timestring
        }
    });
}

function sortDateHelper(a, b) {
   return new Date(a.attributes.startDateTime) < new Date(b.attributes.startDateTime) ? -1 : 1;
}

function sortStringHelper(a, b) {
    return a.attributes.name < b.attributes.name ? -1: 1;
}

function updateEvent(state = initialState.eventActions.events, action) {
    Object.freeze(state);
    switch (action.type) {
    case RECEIVE_EVENTS:
        return action.json.slice().sort(sortDateHelper)
        .map((event) => mapAttributesToEvents(event));
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
    Object.freeze(state);
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
    Object.freeze(state);
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
    case SEND_PERSON:
        return Object.assign({}, state, {
            isReceiving: true
        })
    case UPDATE_NNUMBER:
        return Object.assign({}, state, {
            person: Object.assign({}, state.person, {
                attributes: Object.assign({}, state.person.attributes, {
                   nNumber: action.nNumber
                })
            })
        })
    case UPDATE_EMAIL:
        return Object.assign({}, state, {
            person: Object.assign({}, state.person, {
                attributes: Object.assign({}, state.person.attributes, {
                   contact: Object.assign({}, state.person.attributes.contact, {
                    email: action.email
                   })
                })
            })
        })
    default:
        return state;
    }
}

function skillActions(state = initialState.skillActions, action) {
    Object.freeze(state);
    switch (action.type) {
    case REQUEST_SKILLS:
        return Object.assign({}, state, {
            isReceiving: true,
        });
    case RECEIVE_SKILLS:
    // console.log(action.json.map(obj => obj.attributes.name));
        return Object.assign({}, state, {
            isReceiving: false,
            receivedAt: Date.now(),
            skills: action.json.slice().sort(sortStringHelper)
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

function viewActions(state=initialState.viewActions, action) {
    Object.freeze(state);
    switch (action.type) {
    case TOGGLE_PROFILE_VIEW:
        return Object.assign({}, state, {
            isProfileView: !state.isProfileView
        });
    default:
        return state;
    }
}

const rootReducer = combineReducers({
    loginActions,
    eventActions,
    skillActions,
    viewActions,
})

export default rootReducer;