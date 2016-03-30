import React, { PropTypes } from 'react';
import Event from './Event';

function EventList({events, onEventClick, onRsvpClick}) {
    return <div>
        <ul className='list-group'>
            {events.map((event, i) => <Event key={i} {...event} onClick={() => onEventClick(i)}/>
        )}
        </ul>
        <div className='rsvp-button-container'>
            <div className='row'>
            <button className='btn rsvp-button pull-right' onClick={onRsvpClick}>RSVP</button>
            </div>
        </div>

    </div>
}

EventList.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    onEventClick: PropTypes.func.isRequired,
    onRsvpClick: PropTypes.func.isRequired
}

export default EventList
