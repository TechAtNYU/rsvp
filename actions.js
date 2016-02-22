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

export function fetchPerson() {
	return function(dispatch) {
		dispatch(requestLogin);
		return $.get('https://api.tnyu.org/v3/people/me')
		.done(response => dispatch(receiveLogin(response.data)))
		.fail(() => dispatch(failLogin()));
	}
}