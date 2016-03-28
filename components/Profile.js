import React, { PropTypes } from 'react';

function print(val) {
	console.log(val);
}

function Profile({attributes, inputHandlers}) {
    return <form className='col-md-10'>
	    <h2>PROFILE</h2>
	    <fieldset className='form-group'>
		    <label>N-Number</label>
		    <input type='nNumber' className='form-control'
		    onChange={(e) => inputHandlers.handleNNumber(e.target.value)}
		    defaultValue={attributes.nNumber}></input>
		    <small className='text-muted'>Please put your N-number here (NYU-only)</small>
	    </fieldset>
	    <fieldset className='form-group'>
		   	<label>Email</label>
		    <input type='email' className='form-control'
		    onChange={(e) => inputHandlers.handleEmail(e.target.value)}
		    defaultValue={attributes.contact.email}></input>
		   	<small className="text-muted">Is this your active email?</small> 
	    </fieldset>
	    <button type='submit' className='btn'>SUBMIT</button>
	</form>
}

Profile.propTypes = {
    // nNumber: PropTypes.string.isRequired,
}

export default Profile
