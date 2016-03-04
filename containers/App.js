import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { shouldFetchFb } from '../actions'
// import VisibleEventList from './VisibleEventList'
import Home from './Home'
import Welcome from './Welcome'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let loginView = (this.props.didLogin) ? <Home /> : <Welcome />
        return <div>
        {loginView}
	    </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginActions: state.loginActions,
        didLogin: state.loginActions.didLogin
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onEventClick: (id) => dispatch(toggleEvent(id)),
//         onRsvpClick: () => dispatch(rsvpToEvents())
//     };
// };


export default connect(mapStateToProps)(App);
