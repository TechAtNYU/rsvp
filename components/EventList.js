import React, { PropTypes } from 'react';
import Event from './Event';

function EventList({events, onEventClick, onRsvpClick}) {
    return <div className='col-md-8'>
        <ul className='list-group'>
            {events.map((event, i) => <Event key={i} {...event} onClick={() => onEventClick(i)}/>
        )}
        </ul>
        <button onClick={() => onRsvpClick()}>RSVP</button>
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
