import React, { PropTypes } from 'react';

const Event = ({ onClick, selected, attributes }) => {
    return <li
    className='list-group-item'
    style={{
        color: selected ? 'red': 'black'
    }}>
    {attributes.title}
    <input type='checkbox' onClick={onClick} />
    </li>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
}

export default Event
