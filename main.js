var React = require('react');
var ReactDOM = require('react-dom');
var EmailNode = require('./components/EmailNode.js');
var UserStat = require('./components/UserStat.js');
var DropDownMenu = require('./components/DropDownMenu.js');

window.API_VERSION = 'v3';
var AppHandler = React.createClass({
	getInitialState: function() {
		return {
			loggedIn: false,
			userId: '',
			nNumberExists: false,
			nNumber: '',
			emailExists: false,
			email: '',
			venueIds: [],
			venueNames: [],
			venueAddresses: [],
			venueCaps: [],
			eventTitles: [],
			eventIds: [],
			eventStartDates: [],
			rawJson: [],
			rsvpdEvents: [],
			rsvpComplete: false,
			finishUserStatSubmit: false,
			totalRsvps: [],
			facebookUrls: []
		};
	},

	componentWillMount: function() {
		$.getJSON('https://api.tnyu.org/' + window.API_VERSION + '/people/me')
		.done( (user) => {
			// user is logged in, check for nNumber and email existence
			var nNumberExists = ('nNumber' in user.data.attributes) ? true: false;
			var emailExists = false;
			var email = '';
			if ('email' in user.data.attributes.contact) {
				emailExists = true;
				email = user.data.attributes.contact.email;
			}

			this.setState({
				loggedIn: true,
				userId: user.data.id,
				nNumberExists: nNumberExists,
				emailExists: emailExists,
				email: email
			});

			// get events
			$.getJSON('https://api.tnyu.org/' + window.API_VERSION + '/events/upcoming-publicly?page%5Blimit%5D=10&sort=startDateTime')
			.done( (json) => {
				var eventIds = [], eventTitles = [], eventStartDates = [],  venueIds = [], rsvps = [], rsvpdEvents = [];
				json.data.map( (event) => {
					var alreadyRsvpd = event.relationships.rsvps.data.some( (person) => {
						return person.id.toString() === this.state.userId.toString();
					});

					rsvpdEvents.push(alreadyRsvpd);
					eventIds.push(event.id);
					eventTitles.push(event.attributes.title);
					eventStartDates.push(event.attributes.startDateTime);
					venueIds.push(event.relationships.venue.data.id || undefined);
					rsvps.push(event.relationships.rsvps.data.length);
				});

				this.setState({
					venueIds: venueIds,
					eventTitles: eventTitles,
					eventIds: eventIds,
					eventStartDates: eventStartDates,
					rawJson: json.data,
					totalRsvps: rsvps,
					rsvpdEvents: rsvpdEvents
				});
			}).then( () => {
				var venueNames = this.state.venueNames, venueAddresses = this.state.venueAddresses, venueCaps = this.state.venueCaps;
				this.state.venueIds.map( (venueId) => {
					$.getJSON('https://api.tnyu.org/' + window.API_VERSION + '/venues/' + venueId.toString()).done((json) => {
						venueNames.push(json.data.attributes.name || undefined);
						venueAddresses.push(json.data.attributes.address || undefined);
						venueCaps.push(json.data.attributes.seats || undefined);
					}).then(() => {
						this.setState({
							venueNames: venueNames,
							venueAddresses: venueAddresses,
							venueCaps: venueCaps
						});
					});
				});
			});
		})
	},

	_loginWithFacebook: function() {
		var url = 'https://api.tnyu.org/' + window.API_VERSION + '/auth/facebook?success=' + window.location;
		window.location.href = url;
	},

	_onRsvpCompleted: function() {
		this.setState({ rsvpComplete: true });
	},

	_onFinishUserStat: function() { this.setState({ finishUserStatSubmit: true }); },

	_onUserStatSubmit: function(email, nNumber) {
		var id = this.state.userId;
		var data = { 
			'data': {
				'type': 'people',
				'id': id,
				'attributes': {
					'contact': {}
				}
			}
		}

		if (email || nNumber) {
			if (email) data.data.attributes.contact['email'] = email;
			if (nNumber) data.data.attributes['nNumber'] = nNumber;

			$.ajax({
				type: 'PATCH',
				acccepts: 'application/vnd.api+json',
				contentType: 'application/vnd.api+json',
				url: 'https://api.tnyu.org/' + this.state.API_VERSION + '/people/me',
				crossDomain: true,
				dataType: 'json',
				data: JSON.stringify(data),
			});
		}
		this._onFinishUserStat();
	},

	render: function() {
		var loginNode = (
			<div className='fb-login'>
			<button className='btn btn-primary btn-lg text-center' onClick={this._loginWithFacebook}>Login with Facebook</button>
			</div>
		);

		var userStatNode = (!this.state.finishUserStatSubmit) ? <UserStat _onUserStatSubmit={this._onUserStatSubmit} emailExists={this.state.emailExists} email={this.state.email} nNumberExists={this.state.nNumberExists} _onCloseWindow={this._onFinishUserStat} /> : null;


		var dropDownNode = (
			<div>
			{userStatNode}
			<DropDownMenu eventTitles={this.state.eventTitles} eventIds={this.state.eventIds} eventStartDates={this.state.eventStartDates} rawJson={this.state.rawJson} _onRsvpCompleted={this._onRsvpCompleted} venueAddr={this.state.venueAddresses} venueCaps={this.state.venueCaps} venueNames={this.state.venueNames} totalRsvps={this.state.totalRsvps} rsvpdEvents={this.state.rsvpdEvents}/>
			</div>
		);

		// different DISPLAY nodes for different state
		var rsvpDoneNode = (
			<h1 className='rsvpDoneText'>RSVP completed. Remember to check-in at the event! Thanks!</h1>
		)

		var renderNode = (this.state.rsvpComplete) ? rsvpDoneNode: (this.state.loggedIn) ? dropDownNode : loginNode;

		return (
			<div className='main'>
			<header>
			<a href='http://techatnyu.org/'><img src='images/techatnyu.png' alt='tech@nyu logo' className='logo'/></a>
			<div>
			<h3 className='title'>Tech@NYU Event RSVP Form</h3>
			<p className='description'>The largest student-run tech organization in NYC</p>
			</div>
			</header>
			<div className='form'>
			{renderNode}
			</div>
			</div>
		);
	}
});

ReactDOM.render(<AppHandler />, document.getElementById('app'));
