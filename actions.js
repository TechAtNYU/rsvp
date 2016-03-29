export const TOGGLE_PROFILE_VIEW = 'TOGGLE_PROFILE_VIEW';
export const TOGGLE_EVENT = 'TOGGLE_EVENT';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const FAIL_LOGIN = 'FAIL_LOGIN';
export const REQUEST_EVENTS = 'REQUEST_EVENTS';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const FAIL_TO_GET_EVENTS = 'FAIL_TO_GET_EVENTS';
export const REQUEST_VENUE = 'REQUEST_VENUE';
export const RECEIVE_VENUE = 'RECEIVE_VENUE';
export const RECEIVE_ALL_VENUES = 'RECEIVE_ALL_VENUES';
export const FAIL_TO_RECEIVE_VENUE = 'FAIL_TO_RECEIVE_VENUE';
export const REQUEST_SKILLS = 'REQUEST_SKILLS';
export const RECEIVE_SKILLS = 'RECEIVE_SKILLS';
export const FAIL_TO_GET_SKILLS = 'FAIL_TO_GET_SKILLS';
export const RSVPD_TO_EVENT = 'RSVPD_TO_EVENT';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_NNUMBER = 'UPDATE_NNUMBER';
export const SEND_PERSON = 'SEND_PERSON';

export function fetchAll() {
    return (dispatch, getState) => {
        dispatch(fetchPerson()).then(() => dispatch(fetchEvents())
            .then(() => Promise.all(
                getState().eventActions.events.map((event, i) => dispatch(fetchVenue(event.relationships.venue.data.id, i))))
                .then(() => dispatch(fetchSkills())
            )
        ))
    }
}

export function updateEmail(email) {
    return {
        type: UPDATE_EMAIL,
        email
    }
}

export function updateNNumber(nNumber) {
    return {
        type: UPDATE_NNUMBER,
        nNumber
    }
}

function sendPerson() {
    return {
        type: SEND_PERSON
    }
}

export function postPerson() {
    return (dispatch, getState) => {
        dispatch(sendPerson());
        const person = Object.assign({}, getState().loginActions.person, {
            type: 'people',
            id: getState().loginActions.person.id,
            attributes: {
                nNumber: getState().loginActions.person.attributes.nNumber,
                contact: getState().loginActions.person.attributes.contact,
            }
        });
        const data = {
            data: person,
        };
        $.ajax({
                type: 'PATCH',
                acccepts: 'application/vnd.api+json',
                contentType: 'application/vnd.api+json',
                url: 'https://api.tnyu.org/' + window.API_VERSION + '/people/me',
                crossDomain: true,
                dataType: 'json',
                data: JSON.stringify(data),
            })
        .done( response => {
            dispatch(receiveLogin(response.data));
            dispatch(toggleProfile());
        })
        .fail( e => console.log(e.responseText));
    }
}

export function toggleProfile() {
    return {
        type: TOGGLE_PROFILE_VIEW
    }
}

export function toggleEvent(index) {
    return {
        type: TOGGLE_EVENT,
        index
    }
}

export function requestLogin() {
    return {
        type: REQUEST_LOGIN
    };
}

export function receiveLogin(json) {
    return {
        type: RECEIVE_LOGIN,
        receivedAt: Date.now(),
        json
    };
}

export function failLogin() {
    return {
        type: FAIL_LOGIN
    };
}

export function shouldFetchFb() {
    window.location.href = 'https://api.tnyu.org/' + window.API_VERSION + '/auth/facebook?success=' + window.location;
}

export function fetchPerson() {
    return (dispatch) => {
        dispatch(requestLogin);
        return $.get('https://api.tnyu.org/' + window.API_VERSION + '/people/me')
            .done(response => dispatch(receiveLogin(response.data)))
            .fail(() => dispatch(failLogin()));
    }
}

export function requestEvents() {
    return {
        type: REQUEST_EVENTS
    };
}

export function receiveEvents(upcomingEvents, getState) {
    let personId = getState().loginActions.person.id;
    let json = checkIfRsvpd(upcomingEvents, personId);
    return {
        type: RECEIVE_EVENTS,
        receivedAt: Date.now(),
        json
    }
}

function checkIfRsvpd(json, personId) {
    return json.map((event, i) => {
        if (event.relationships.rsvps.data.filter((person) => person.id === personId).length > 0)
            event.rsvp = true;
        return event;
    });
}

export function failToGetEvents() {
    return {
        type: FAIL_TO_GET_EVENTS
    }
}

export function fetchEvents() {
    return function(dispatch, getState) {
        dispatch(requestEvents);
        return $.get('https://api.tnyu.org/' + window.API_VERSION + '/events/upcoming-publicly?page%5Blimit%5D=10&sort=startDateTime?')
            .done(response => dispatch(receiveEvents(response.data, getState)))
            .fail(() => dispatch(failToGetEvents()));
    }
}


export function requestVenue(index) {
    return {
        type: REQUEST_VENUE,
        index
    };
}

export function receiveVenue(index, json) {
    return {
        type: RECEIVE_VENUE,
        index,
        json
    }
}

export function receivedAllVenues() {
    return {
        type: RECEIVE_ALL_VENUES
    }
}

export function failToGetVenue(index) {
    return {
        type: FAIL_TO_RECEIVE_VENUE,
        index
    };
}

export function fetchVenue(id, index) {
    return (dispatch) => {
        dispatch(requestVenue);
        return $.get('https://api.tnyu.org/' + window.API_VERSION + '/venues/' + id)
            .done(response => dispatch(receiveVenue(index, response.data)))
            .fail(() => dispatch(failToGetVenue(index)));
    }
}


function requestSkills() {
    return {
        type: REQUEST_SKILLS
    };
}

function receiveSkills(json) {
    return {
        type: RECEIVE_SKILLS,
        json
    };
}

function failToGetSkills() {
    return {
        type: FAIL_TO_GET_SKILLS
    };
}

export function fetchSkills() {
    return (dispatch) => {
        dispatch(requestSkills);
        return $.get('https://api.tnyu.org/' + window.API_VERSION + '/skills')
            .done(response => dispatch(receiveSkills(response.data)))
            .fail(() => dispatch(failToGetSkills()));
    }
}

export function rsvpd(index) {
    return {
        type: RSVPD_TO_EVENT,
        index
    };
}

export function rsvpToEvents() {
    return (dispatch, getState) => {
        getState().eventActions.events.map((event, i) => {
            if (event.selected) $.get('https://api.tnyu.org/' + window.API_VERSION + '/events/' + event.id + '/rsvp')
                .done(() => dispatch(rsvpd(i)))
                .fail(() => console.log('RSVP to ' + event.attributes.title + ' failed. Try again later.'));
        })
    }
}

