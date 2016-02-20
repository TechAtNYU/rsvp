import { combineReducers } from 'redux';
import { TOGGLE_EVENT } from './actions';

const initialState = {
    events: [
        { id: 0,
        rsvpd: false, 
        name: 'test event', 
        time: '12:00'},
        { id: 1,
        rsvpd: false, 
        name: 'test event', 
        time: '12:00'}
    ]
};

function events(state = [], action) {
    switch (action.type) {
        case TOGGLE_EVENT: {
            console.log("toggled");
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

function eventApp(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_EVENT:
            return Object.assign({}, state, {
                events: events(state.events, action)
            });
        default:
            return state;
    }
}

export default eventApp;
