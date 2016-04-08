import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
    toggleProfile,
    updateEmail,
    updateNNumber,
    postPerson,
    filterSkills,
    updateActiveTypeaheadField,
    deleteTypeaheadSelection,
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
        const { toggleProfileOnClick, person, inputHandlers} = this.props;
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
                    { this.props.didLogin ?
                        <div className='pull-right'>
                        <button onClick={toggleProfileOnClick} className='btn'>{this.props.isProfileView ? 'Event List': 'Profile'}</button>
                        </div> :
                    null }
                    { 
                        this.props.isReceiving ?
                            <h2 className='loading'>...Tech@NYU RSVP is loading.</h2>:
                            this.props.didLogin ? this.props.isProfileView ? (
                            <Profile attributes={person.attributes} inputHandlers={inputHandlers}>
                                <Typeahead
                                    title='Skills'
                                    width='200px'
                                    fieldType='skillsPersonHas'
                                    domId='skillsPersonHas'
                                    list={this.props.skillActions.skills}
                                    {...this.props.skillActions.skillsPersonHas}
                                    {...inputHandlers.skillsPersonHas}
                                />
                                <Typeahead
                                    title='Wants to Learn'
                                    width='200px'
                                    fieldType='wantsToLearn'
                                    domId='wantsToLearn'
                                    list={this.props.skillActions.skills}
                                    {...this.props.skillActions.wantsToLearn}
                                    {...inputHandlers.wantsToLearn}
                                />
                                <Typeahead
                                    title='Wants to Hire'
                                    width='200px'
                                    fieldType='wantsToHire'
                                    domId='wantsToHire'
                                    list={this.props.skillActions.skills}
                                    {...this.props.skillActions.wantsToHire}
                                    {...inputHandlers.wantsToHire}
                                />
                            </Profile>
                            ): <VisibleEventList />: <Welcome />
                    }
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
            skillsPersonHas: {
                filterHandler: query => dispatch(filterSkills(query, 'skillsPersonHas')),
                keyPressHandler: keyCode => dispatch(updateActiveTypeaheadField(keyCode, 'skillsPersonHas')),
                deleteSelection: i => dispatch(deleteTypeaheadSelection(i, 'skillsPersonHas')),
            },
            wantsToLearn: {
                filterHandler: query => dispatch(filterSkills(query, 'wantsToLearn')),
                keyPressHandler: keyCode => dispatch(updateActiveTypeaheadField(keyCode, 'wantsToLearn')),
                deleteSelection: i => dispatch(deleteTypeaheadSelection(i, 'wantsToLearn')),
            },
            wantsToHire: {
                filterHandler: query => dispatch(filterSkills(query, 'wantsToHire')),
                keyPressHandler: keyCode => dispatch(updateActiveTypeaheadField(keyCode, 'wantsToHire')),
                deleteSelection: i => dispatch(deleteTypeaheadSelection(i, 'wantsToHire')),
            },
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(App);
