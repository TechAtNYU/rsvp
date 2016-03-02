import React, { PropTypes } from 'react';

function formatTime(startDateTime) {
    let hour = parseInt(startDateTime.substring(11, 13)) - 5;
    hour = hour < 0 ? hour + 12 : hour;
    return {
        date: startDateTime.substring(0, 10),
        hour: hour.toString(),
        minute: startDateTime.substring(14, 16)
    }
}

const Event = ({onClick, selected, attributes, rsvp}) => {
    let timeObj = formatTime(attributes.startDateTime);
    let rsvpField = rsvp ? <span>RSVP'd</span> : <input type='checkbox' onClick={onClick} />;
    return <li
        className='list-group-item row'
        style={{
            color: selected ? 'red' : 'black'
        }}>
        <div className='col-md-3 col-sm-4 when'>
            <p>{timeObj.date}</p>
            <p>{timeObj.hour + ':' + timeObj.minute}</p>
        </div>
        <div className='col-md-8 col-sm-6'>
            <span>{attributes.title}</span>
        </div>
        <div className='col-md-1 col-sm-2'>
            {rsvpField}
        </div>
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    rsvp: PropTypes.bool.isRequired
}

export default Event
