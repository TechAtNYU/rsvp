var React = require('react');

var EmailNode = React.createClass({
	render: function() {
		var emailNode = (this.props.exists) ? (
			<div>
			<p>Is this your preferred email?</p>
			<p id='user_email'>{this.props.email}</p>
			<button className='btn btn-sm' onClick={this.props._toChangeEmail}>Change my email (optional)</button>
			</div>
		) : (
		<div className='email-field col-md-12'>
		<div className='col-md-3'><span>Email: </span></div>
		<div className='col-md-9'><input type='text' onChange={this.props._onEmailInput} /></div>
		</div>
		);
		return emailNode;
	}
});

module.exports = EmailNode;
