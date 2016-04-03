import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
    toggleProfile,
    updateEmail,
    updateNNumber,
    postPerson,
    filterSkills,
    updateActiveTypeaheadField,
} from '../actions'
import VisibleEventList from './VisibleEventList'
import Profile from '../components/Profile'
import Welcome from './Welcome'
import Typeahead from '../components/Typeahead'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { toggleProfileOnClick, person, inputHandlers, keyPressHandler} = this.props;
        const loginView = this.props.isReceiving ? <h2 className='loading'>...Tech@NYU RSVP is loading.</h2>:
        this.props.didLogin ? this.props.isProfileView ? <Profile attributes={person.attributes} inputHandlers={inputHandlers} />: <VisibleEventList />:<Welcome />;
        return (
            <div>
                <header>
                    <a href='http://techatnyu.org/'><img src='images/techatnyu.png' alt='tech@nyu logo' className='logo'/></a>
                    <div>
                    <h3 className='title'>Tech@NYU Event RSVP Form</h3>
                    <p className='description'>The largest student-run tech organization in NYC</p>
                    </div>
                </header> 
                <div className='form'>
                    <div className='col-md-10 col-md-offset-1'>
                        <Typeahead
                        {...this.props.skillActions}
                        width='200px'
                        filterHandler={inputHandlers.handleFilteredSkills}
                        keyPressHandler={keyPressHandler} />
                    
                    { this.props.didLogin ?
                        <div className='pull-right'>
                        <button onClick={toggleProfileOnClick} className='btn'>{this.props.isProfileView ? 'Event List': 'Profile'}</button>
                        </div> :
                    null }
                    {loginView}
                    </div>
                </div>
    	    </div>)
    }
}

const mapStateToProps = state => {
    return {
        person: state.loginActions.person,
        didLogin: state.loginActions.didLogin,
        isReceiving: state.loginActions.isReceiving,
        isProfileView: state.viewActions.isProfileView,
        // skills: state.skillActions.skills,
        // filtered: state.skillActions.filtered,
        skillActions: state.skillActions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleProfileOnClick: _ => dispatch(toggleProfile()),
        inputHandlers: {
           handleEmail: email => dispatch(updateEmail(email)),
           handleNNumber: nNumber => dispatch(updateNNumber(nNumber)),
           handleSubmit: _ => dispatch(postPerson()),
           handleFilteredSkills: query => dispatch(filterSkills(query)),
        },
        keyPressHandler: keyCode => dispatch(updateActiveTypeaheadField(keyCode)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(App);
