import React, { PropTypes } from 'react';

function Event({onClick, selected, attributes, rsvp, timeObj, relationships, venueSize}) {
    const rsvpField = rsvp ? <span>RSVP'd</span> :
    relationships.rsvps.data.length < venueSize*2 ? <input type='checkbox' onClick={onClick} /> :
    <span>Event FULL</span>;

    return <li
        className='list-group-item list-group-item clearfix'
        style={{
            backgroundColor: selected ? 'lightgray' : 'white'
        }}>
        <div className='col-sm-2 col-xs-4 when'>
            <div className='date'>
                <p>{timeObj.date}</p>
                <p>{timeObj.hour + ':' + timeObj.minute + timeObj.timestring}</p>
            </div> 
        </div>
        <div className='col-sm-8 col-xs-5 event-title'>
            <span>{attributes.title}</span>
        </div>
        <div className='col-sm-2 col-xs-3 rsvpd'>
            {rsvpField}
        </div>
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    // rsvp: PropTypes.bool.isRequired
}

export default Event
