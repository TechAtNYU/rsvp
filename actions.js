import fuzzy from 'fuzzy';
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
export const FILTER_SKILLS = 'FILTER_SKILLS';
export const SKILL_ROLLOVER = 'SKILL_ROLLOVER';
export const SELECT_SKILL_FIELD = 'SELECT_SKILL_FIELD';
export const DELETE_SKILL_SELECTION = 'DELETE_SKILL_SELECTION';

export function fetchAll() {
    return (dispatch, getState) => {
        dispatch(fetchPerson()).then( _ => dispatch(fetchEvents())
            .then( _ => Promise.all(
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

function mapSkillsToPerson(skills) {
    return {
        data: skills.map( skill => {
            return {
                type: 'skill',
                id: skill.id }
            })
    }
}

export function postPerson() {
    return (dispatch, getState) => {
        dispatch(sendPerson());
        const nNumber = getState().loginActions.person.attributes.nNumber;
        const skillsPersonHas = getState().skillActions['skillsPersonHas'].selected;
        const wantsToLearn = getState().skillActions['wantsToLearn'].selected;
        const wantsToHire = getState().skillActions['wantsToHire'].selected;
        const contact = getState().loginActions.person.attributes.contact;
        const person = Object.assign({}, getState().loginActions.person, {
            type: 'people',
            id: getState().loginActions.person.id,
            attributes: {
                contact: {}
            },
            relationships: {}
        });
        if (nNumber) if (nNumber.length > 0) person.attributes.nNumber = nNumber;
        if (contact) {
            if (contact.email) person.attributes.contact.email = contact.email;
        }
        if (skillsPersonHas.length > 0) person.relationships.skills = mapSkillsToPerson(skillsPersonHas);
        if (wantsToLearn.length > 0) person.relationships.wantsToLearn = mapSkillsToPerson(wantsToLearn);
        if (wantsToHire.length > 0) person.relationships.wantsToHire = mapSkillsToPerson(wantsToHire);
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

function updateFilteredSkills(filtered, fieldType, word) {
    return {
        type: FILTER_SKILLS,
        filtered,
        fieldType
    }
}

/*
Using `fuzzy` wordfilter to do fuzzy string matching on skill typeahead.
returns filtered names only
*/
export function filterSkills(word, fieldType) {
    return (dispatch, getState) => {
        const options = { extract: el => el.attributes.name };
        const results = fuzzy.filter(word, getState().skillActions.skills, options).map( el => el.string);
        dispatch(updateFilteredSkills(results, fieldType, word));
    }
}

function selectTypeaheadField(fieldType) {
    return {
        type: SELECT_SKILL_FIELD,
        fieldType
    }
}

function moveTypeaheadPointer(move, fieldType) {
    return {
        type: SKILL_ROLLOVER,
        move,
        fieldType
    }
}

export function updateActiveTypeaheadField(keyCode, fieldType) {
    // up 38, down 40, left 37, right 39, enter 13
    return dispatch => {
        if (keyCode === 38) dispatch(moveTypeaheadPointer(-1, fieldType));
        if (keyCode === 40) dispatch(moveTypeaheadPointer(1, fieldType));
        if (keyCode === 13) dispatch(selectTypeaheadField(fieldType));

    }
}

export function onHoverTypeahead(index, fieldType) {
    return (dispatch, getState) => {
        dispatch(moveTypeaheadPointer(index - getState().skillActions[fieldType].currentIdx, fieldType));
    }
}

export function deleteTypeaheadSelection(index, fieldType) {
    return {
        type: DELETE_SKILL_SELECTION,
        index,
        fieldType
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
        return $.get('https://api.tnyu.org/' + window.API_VERSION + '/events/upcoming-publicly?page%5Blimit%5D=15&sort=startDateTime?')
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

function receiveSkills(allSkills, personSkills, wantsToLearn, wantsToHire) {
    return {
        type: RECEIVE_SKILLS,
        allSkills,
        personSkills,
        wantsToLearn,
        wantsToHire
    };
}

function failToGetSkills() {
    return {
        type: FAIL_TO_GET_SKILLS
    };
}

export function fetchSkills() {
    return (dispatch, getState) => {
        dispatch(requestSkills);
        const personSkills =  getState().loginActions.person.relationships.skills.data;
        const wantsToLearn =  getState().loginActions.person.relationships.wantsToLearn.data;
        const wantsToHire =  getState().loginActions.person.relationships.wantsToHire.data;
        return $.get('https://api.tnyu.org/' + window.API_VERSION + '/skills')
            .done(response => dispatch(receiveSkills(response.data,
                personSkills, wantsToLearn, wantsToHire)))
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
