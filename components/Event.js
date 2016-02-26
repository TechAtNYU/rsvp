import React, { PropTypes } from 'react';

const Event = ({ onClick, rsvpd, attributes }) => {
    return <li
    className='list-group-item'
    style={{
        color: rsvpd ? 'red': 'black'
    }}>
    {attributes.title}
    <input type='checkbox' onClick={onClick} />
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    rsvpd: PropTypes.bool.isRequired
}

export default Event
