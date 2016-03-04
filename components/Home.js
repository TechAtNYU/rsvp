import React, { PropTypes } from 'react';
import VisibleEventList from '../containers/VisibleEventList'

function Home() {
    return <div>
	<VisibleEventList />
	</div>
}

Event.propTypes = {
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    rsvp: PropTypes.bool.isRequired
}

export default Event