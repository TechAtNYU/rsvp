import React, { PropTypes } from 'react';

const Event = ({ onClick, rsvpd, name }) => {
    return <li
    onClick={onClick}
    style={{
        nameDecoration: rsvpd ? 'strikethrough': 'none'
    }}>
    {name}
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    rsvpd: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
}

export default Event
