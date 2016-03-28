import React, { PropTypes } from 'react';

function Profile({}) {
    return <form>
	    PROFILE WHAT
	    <fieldset className='form-group'>
	    <label for='nNumber'>N-Number</label>
	    <input type='nNumber' className='form-control' placeholder='Please put your N-number here (NYU-only)'></input>
	    </fieldset>
	    <button type='submit' className='btn'>SUBMIT</button>
	</form>
}

Profile.propTypes = {
    // nNumber: PropTypes.string.isRequired,
}

export default Profile
