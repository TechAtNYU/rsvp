import React, { PropTypes } from 'react';

const Event = ({ onClick, selected, attributes, rsvp }) => {
    return <li
    className='list-group-item'
    style={{
        color: selected ? 'red': 'black'
    }}>
    {attributes.title}
    {(rsvp) => rsvp ? <input type='checkbox' onClick={onClick} /> : null}
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    rsvp: PropTypes.bool.isRequired
}

export default Event
