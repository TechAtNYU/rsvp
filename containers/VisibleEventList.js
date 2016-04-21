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
                <div className='row' id='nNumber-notice'>
                <small className='text-muted pull-left'>Filling out your N-number on Profile can make the checkin process smoother (NYU-only)</small>
                </div>
	            { 
	            	this.props.isReceiving ?
	            	<h2 className='loading'>...events are loading.</h2>:
	            	<EventList {...this.props} />
	            }
            </div>
    		)
    }
}
const mapStateToProps = state => {
    return {
        events: state.eventActions.events,
        isReceiving: state.eventActions.isReceiving,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onEventClick: id => dispatch(toggleEvent(id)),
        onRsvpClick: _ => dispatch(rsvpToEvents())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisibleEventList);
