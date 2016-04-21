import React, { PropTypes } from 'react';

function NoLogin({onFbClick}) {
    return <div className='fb-login'>
    	<button className='btn btn-primary btn-lg text-center'
        onClick={onFbClick}>Login with Facebook</button>
    </div>
}

NoLogin.propTypes = {
    onFbClick: PropTypes.func.isRequired,
    didLogin: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired
}

export default NoLogin;