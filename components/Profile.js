import React, { PropTypes } from 'react';


function Profile({attributes, inputHandlers, children}) {
    return <div className='profile'>
	    <h2 id='upcoming'>PROFILE</h2>
	    <div className='form-group'>
		    <label>N-Number</label>
		    <input type='text' className='form-control'
		    style={{
		    	border: (attributes.nNumberValid === true || attributes.nNumberValid === undefined) ? null : '1px solid red'
		    }}
		    onChange={ e => inputHandlers.handleNNumber(e.target.value)}
		    defaultValue={attributes.nNumber}></input>
		    <small className='text-muted'>Please put your N-number here (NYU-only)</small>
	    </div>
	    <div className='form-group'>
		   	<label>Email</label>
		    <input type='text' className='form-control'
		    onChange={ e => inputHandlers.handleEmail(e.target.value)}
		    defaultValue={attributes.contact.email}></input>
		   	<small className="text-muted">Is this your active email?</small> 
	    </div>
	    <div className='form-group'>
	    	{children}
	    </div>
	    <button onClick={inputHandlers.handleSubmit} className='btn'>SUBMIT</button>
	</div>
}

Profile.propTypes = {
    // nNumber: PropTypes.string.isRequired,
}

export default Profile
