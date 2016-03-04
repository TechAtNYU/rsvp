import React , { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { shouldFetchFb } from '../actions'
import VisibleEventList from './VisibleEventList'
import Welcome from './Welcome'
// import VisibleHome from './VisibleHome'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let loginView = (this.props.didLogin) ? <VisibleEventList /> : <Welcome />
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

export default connect(mapStateToProps)(App);
