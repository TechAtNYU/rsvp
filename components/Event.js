import React, { PropTypes } from 'react';

const Event = ({ onClick, rsvpd, attributes }) => {
    return <li
    onClick={onClick}
    style={{
        nameDecoration: rsvpd ? 'strikethrough': 'none'
    }}>
    {attributes.title}
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    rsvpd: PropTypes.bool.isRequired
}

export default Event
