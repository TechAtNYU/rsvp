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
        const loginView = this.props.isReceiving ? <h2 className='loading'>...Tech@NYU RSVP is loading.</h2>:
        this.props.didLogin ? <VisibleEventList />:<Welcome />;
        return <div>
        <header>
            <a href='http://techatnyu.org/'><img src='images/techatnyu.png' alt='tech@nyu logo' className='logo'/></a>
            <div>
            <h3 className='title'>Tech@NYU Event RSVP Form</h3>
            <p className='description'>The largest student-run tech organization in NYC</p>
            </div>
        </header> 
            <div className='form'>
            {loginView}
            </div>
	    </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginActions: state.loginActions,
        didLogin: state.loginActions.didLogin,
        isReceiving: state.loginActions.isReceiving,
    }
}

export default connect(mapStateToProps)(App);
