import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleProfile } from '../actions'
import VisibleEventList from './VisibleEventList'
import Profile from '../components/Profile'
import Welcome from './Welcome'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { toggleProfileOnClick, person, inputHandlers } = this.props;
        const loginView = this.props.isReceiving ? <h2 className='loading'>...Tech@NYU RSVP is loading.</h2>:
        this.props.didLogin ? this.props.isProfileView ? <Profile attributes={person.attributes} inputHandlers={inputHandlers} />: <VisibleEventList />:<Welcome />;
        return <div>
        <header>
            <a href='http://techatnyu.org/'><img src='images/techatnyu.png' alt='tech@nyu logo' className='logo'/></a>
            <div>
            <h3 className='title'>Tech@NYU Event RSVP Form</h3>
            <p className='description'>The largest student-run tech organization in NYC</p>
            </div>
        </header> 
            <div className='form'>
            <button onClick={toggleProfileOnClick} className='btn'>{this.props.isProfileView ? 'Event List': 'Profile'}</button>
            {loginView}
            </div>
	    </div>
    }
}

const mapStateToProps = state => {
    return {
        person: state.loginActions.person,
        didLogin: state.loginActions.didLogin,
        isReceiving: state.loginActions.isReceiving,
        isProfileView: state.viewActions.isProfileView,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleProfileOnClick: _ => dispatch(toggleProfile()),
        inputHandlers: {
           handleEmail: val => console.log('EMAIL: ' + val),
           handleNNumber: val => console.log('nNumber: ' + val),
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(App);
