import fetch from 'isomorphic-fetch';

export const TOGGLE_EVENT = 'TOGGLE_EVENT';
export function toggleEvent(index) {
    return { type: TOGGLE_EVENT, index }
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export function requestLogin() {
	return { type: REQUEST_LOGIN };
}

export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export function receiveLogin(json) {
	return {
		type: RECEIVE_LOGIN,
		receivedAt: Date.now(),
	 	json 
	};
}

export const FAIL_LOGIN = 'FAIL_LOGIN';
export function failLogin() {
	return { type: FAIL_LOGIN };
}

function shouldLoadFb(state) {
	if (state.didInvalidate) {
		window.location.href = 'https://api.tnyu.org/v3/auth/facebook?success=' + window.location;
	} else if (state.isReceiving) {
		return false;
	} else {
		return state.didInvalidate
	}
}

export function fetchPerson() {
	return function(dispatch) {
		dispatch(requestLogin);
		return $.get('https://api.tnyu.org/v3/people/me')
		.done(response => dispatch(receiveLogin(response.data)))
		.fail(() => dispatch(failLogin()));
	}
}

export const REQUEST_EVENTS = 'REQUEST_EVENTS';
export function requestEvents() {
	return { type: REQUEST_EVENTS };
}

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export function receiveEvents(json) {
	return { 
		type: RECEIVE_EVENTS,
		receivedAt: Date.now(),
		json
	}
}

export const FAIL_TO_GET_EVENTS = 'FAIL_TO_GET_EVENTS';
export function failToGetEvents() {
	return { type: FAIL_TO_GET_EVENTS }
}

export function fetchEvents() {
	return function(dispatch) {
		dispatch(requestEvents);
		return $.get('https://api.tnyu.org/v3/events/upcoming-publicly?page%5Blimit%5D=10&sort=startDateTime')
		.done(response => dispatch(receiveEvents(response.data)))
		.fail(() => dispatch(failToGetEvents()));
	}
}




