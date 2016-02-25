import fetch from 'isomorphic-fetch';

export const TOGGLE_EVENT = 'TOGGLE_EVENT';
export function toggleEvent(index) {
	return {
		type: TOGGLE_EVENT,
		index
	}
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export function requestLogin() {
	return {
		type: REQUEST_LOGIN
	};
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
	return {
		type: FAIL_LOGIN
	};
}

function shouldFetchFb() {
	window.location.href = 'https://api.tnyu.org/v3/auth/facebook?success=' + window.location;
}

export function fetchPerson() {
	return (dispatch) => {
		dispatch(requestLogin);
		return $.get('https://api.tnyu.org/v3/people/me')
			.done(response => dispatch(receiveLogin(response.data)))
			.fail(() => dispatch(failLogin()));
	}
}

export const REQUEST_EVENTS = 'REQUEST_EVENTS';
export function requestEvents() {
	return {
		type: REQUEST_EVENTS
	};
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
	return {
		type: FAIL_TO_GET_EVENTS
	}
}

export function fetchEvents() {
	return function(dispatch) {
		dispatch(requestEvents);
		return $.get('https://api.tnyu.org/v3/events/upcoming-publicly?page%5Blimit%5D=10&sort=startDateTime?')
			.done(response => dispatch(receiveEvents(response.data)))
			.fail(() => dispatch(failToGetEvents()));
	}
}


export const REQUEST_VENUE = 'REQUEST_VENUE';
export function requestVenue(index) {
	return {
		type: REQUEST_VENUE,
		index
	};
}

export const RECEIVE_VENUE = 'RECEIVE_VENUE';
export function receiveVenue(index, json) {
	return {
		type: RECEIVE_VENUE,
		index,
		json
	}
}

export const RECEIVE_ALL_VENUES = 'RECEIVE_ALL_VENUES';
export function receivedAllVenues() {
	return {
		type: RECEIVE_ALL_VENUES
	}
}

export const FAIL_TO_RECEIVE_VENUE = 'FAIL_TO_RECEIVE_VENUE';
export function failToGetVenue(index) {
	return {
		type: FAIL_TO_RECEIVE_VENUE,
		index
	};
}

export function fetchVenue(id, index) {
	return (dispatch) => {
		dispatch(requestVenue);
		return $.get('https://api.tnyu.org/v3/venues/' + id)
			.done(response => dispatch(receiveVenue(index, response.data)))
			.fail(() => dispatch(failToGetVenue(index)));
	}
}


export const REQUEST_SKILLS = 'REQUEST_SKILLS';
function requestSkills() {
	return { type: REQUEST_SKILLS };
}

export const RECEIVE_SKILLS = 'RECEIVE_SKILLS';
function receiveSkills(json) {
	return { type: RECEIVE_SKILLS, json };
}

export const FAIL_TO_GET_SKILLS = 'FAIL_TO_GET_SKILLS';
function failToGetSkills() {
	return { type: FAIL_TO_GET_SKILLS };
}

export function fetchSkills() {
	return (dispatch) => {
		dispatch(requestSkills);
		return $.get('https://api.tnyu.org/v3/skills')
		.done(response => dispatch(receiveSkills(response.data)))
		.fail(() => dispatch(failToGetSkills()));
	}
}

