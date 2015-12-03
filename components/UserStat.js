var React = require('react');
var EmailNode = require('./EmailNode.js');
var SkillPanel = require('./SkillPanel.js');

var UserStat = React.createClass({
	getInitialState: function() {
		return {
			email: '',
			nNumber: '',
			changeEmail: false
		}
	},

	_toChangeEmail: function() { this.setState({ changeEmail: true });},

	_onEmailInput: function(e) { this.setState({ email: e.target.value.substring(0, 140) }); },

	_onNNumberInput: function(e) { this.setState({ nNumber: e.target.value.substring(0, 140) }); },

	render: function() {
		var emailNode = (this.props.emailExists && (!this.state.changeEmail)) ? <EmailNode exists={true} _onEmailInput={this._onEmailInput} _toChangeEmail={this._toChangeEmail} email={this.props.email} /> : <EmailNode exists={false} _onEmailInput={this._onEmailInput} />;

		var nNumberNode = (!this.props.nNumberExists) ? (
			<div className='nNumber-field col-md-12'>
			<div className='col-md-4'><span>N-Number (if NYU student): </span></div>
				<div className='col-md-5'><input defaultValue='N' type='text' onChange={this._onNNumberInput} /></div>
			</div>
		): null;

		var submitBtn = ((!this.props.nNumberExists) || (!this.props.emailExists) || this.state.changeEmail) ? (
			<div className='col-md-offset-6'>
			<button onClick={this.props._onUserStatSubmit.bind(null, this.state.email, this.state.nNumber)} className='btn btn-md'>Done</button>
			<br />
			</div>
		): null;

		var comment = ((!this.props.nNumberExists)||(!this.props.emailExists)) ? (
			<p className='user-stat-comment'>Oops. It looks like you are missing some info in your RSVP.</p>
		): (this.state.changeEmail) ? <p className='user-stat-comment'>Fill in your new email.</p> : null;

        // <SkillPanel />
		return (
			<div className='user-stat col-md-8 email-section'>
			<div>
			<div id='user-stat-close' onClick={this.props._onCloseWindow}>Close</div>
			{comment}
			{emailNode}
			{nNumberNode}
			{submitBtn}
			</div>
			</div>
		)
	}
});

module.exports = UserStat;
