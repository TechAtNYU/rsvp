import React, { PropTypes } from 'react';
import Event from './Event';

const EventList = ({ events, onEventClick }) => {
    return <ul className='list-group'>
        {events.map((event, i) => 
                   <Event 
                   key={i}
                    {...event}
                    onClick={() => onEventClick(i)  }
                    />
                   )}
    </ul>
}

EventList.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    onEventClick: PropTypes.func.isRequired
}

export default EventList
