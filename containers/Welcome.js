import { connect } from 'react-redux';
import { shouldFetchFb } from '../actions';
import NoLogin from '../components/NoLogin';

const mapStateToProps = (state) => {
    return {
        state: state,
        didLogin: state.loginActions.didLogin,
        didInvalidate: state.loginActions.didInvalidate
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onFbClick: () => dispatch(shouldFetchFb())
    };
};

const Welcome = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoLogin);

export default Welcome;