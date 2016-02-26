import { connect } from 'react-redux';
import { toggleEvent } from '../actions';
import EventList from '../components/EventList';

const mapStateToProps = (state) => {
    return {
        events: state.eventActions.events
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onEventClick: (id) => {
            dispatch(toggleEvent(id));
        }
    };
};

const VisibleEventList = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList);

export default VisibleEventList;
