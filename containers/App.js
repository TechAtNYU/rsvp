import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { shouldFetchFb } from '../actions'
import VisibleEventList from './VisibleEventList'
import Welcome from './Welcome'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div>
		<Welcome />
		<VisibleEventList />
	    </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginActions: state.loginActions
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onEventClick: (id) => dispatch(toggleEvent(id)),
//         onRsvpClick: () => dispatch(rsvpToEvents())
//     };
// };


export default connect(mapStateToProps)(App);
