import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { toggleEvent, rsvpToEvents } from '../actions';
import EventList from '../components/EventList';

class VisibleEventList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
    	return (
    		<div>
	            <h2 id='upcoming'>UPCOMING EVENTS</h2>
	            <EventList {...this.props} />
            </div>
    		)
    }
}
const mapStateToProps = (state) => {
    return {
        events: state.eventActions.events
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEventClick: (id) => dispatch(toggleEvent(id)),
        onRsvpClick: () => dispatch(rsvpToEvents())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisibleEventList);
