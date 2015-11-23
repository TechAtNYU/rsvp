var React = require('react');
var ReactDOM = require('react-dom');
var Select = require('react-select');

window.API_VERSION = 'v3';

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

var Typeahead = React.createClass({
	getInitialState: function() {
		return {
			inputVal: '',
			possibleSelections: [],
			selectedList: [],
			indexCurrent: 0
		}
	},
	_handleUp: function() {
		if (this.state.indexCurrent > 0) this.setState({ indexCurrent: this.state.indexCurrent - 1});
	},
	_handleDown: function() {
		if (this.state.indexCurrent + 1 < this.state.possibleSelections.length) this.setState({ indexCurrent: this.state.indexCurrent + 1});
	},
	_handleEnter: function() {
	
	},
	_handleInput: function(e) {
		e.preventDefault();
		if (e.keyCode === 38) this._handleUp();
		else if (e.keyCode === 40) this._handleDown();
		else if (e.keyCode === 13) this._handleEnter();
		else {
			var inputVal = e.target.value;
			this.setState({inputVal: inputVal});
			this._getPossibleSelections(inputVal);
		}
	},
	_getPossibleSelections: function(inputVal) {
		var possibleSelections = (inputVal.length > 0) ? this.props.options.filter((option) => {
			return option.substring(0, inputVal.length) === inputVal;
		}): [];
		this.setState({ possibleSelections: possibleSelections });
	},
	render: function() {
		var possibleSelections = [];
		var dropDown = (this.state.inputVal.length > 0) ? this.state.possibleSelections.map((selection, i) => {
			var selected =  (i === this.state.indexCurrent) ? 'selected' : '';
			return (
				<div className={"possibleSelection" + selected} key={i}>
					<span>{selection}</span>
				</div>
			)
		}): null;

		return(
			<div>
			<input type="text" placeholder="e.g. python" onKeyUp={this._handleInput}></input>
			<div className="possibleSelectionList">
			{dropDown}
			</div>
			</div>
		)
	}
});

var SkillPanel = React.createClass({
	getInitialState: function() {
		return {
			skillList: [],
			skillNameList:[]
		}
	},
	componentWillMount: function() {
		$.getJSON('https://api.tnyu.org/' + window.API_VERSION + '/skills')
		.then((skillList) => {
			var skillNameList = [];
			var transformedSkillList = skillList.data.map((skill) => {
				skillNameList.push(skill.attributes.name);
				return {
					id: skill.id,
					name: skill.attributes.name,
					category: skill.attributes.category
				}
			});
			this.setState({ skillList: transformedSkillList, skillNameList: skillNameList});
		});
	},
	render: function() {
		return (
			<div>
			<span>What are your skills? If you are interested, we are collecting people's skillset to do things like, match you up to someone to build a project if you are interested, create better events that match your interests/skills, etc.</span>
			<Typeahead options={this.state.skillNameList}/>
			</div>
		)
	}
});

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

var DropDownMenu = React.createClass({
	getInitialState: function() {
		return {
			selectedEvents: {},
			defaultVenueSize: 200
		};
	},

	_getRSVP: function() {
		var selected = this.state.selectedEvents;
		var len = Object.keys(selected).length;
		this.props.eventIds.map((id, i) => {
			if (selected[id]) { 
				$.ajax({
					type: 'GET',
					acccepts: 'application/vnd.api+json',
					ContentType: 'application/vnd.api+json',
					url: 'https://api.tnyu.org/' + window.API_VERSION + '/events/' + id + '/rsvp',
					async: false,
					dataType: 'jsonp'
				});
			}
		});
		if (len > 0) this.props._onRsvpCompleted();
	},

	_toggleCheckbox: function(i) {
		var id = this.props.eventIds[i];
		var selected = this.state.selectedEvents;

		selected[id] = (id in selected) ? (selected[id] === true) ? false: true : true;

		this.setState({ selectedEvents: selected });
	},

	_getTime: function(i) {
		var date = this.props.eventStartDates[i].substring(0, 10);
		var time = this.props.eventStartDates[i].substring(11, 16);
		var det = parseInt(time.substring(0, 2));
		var timeStr = (det < 12) ? 'AM': 'PM';

		// convert UST to EST
		time = (parseInt(time.substring(0, 2)) - 5).toString() + time.substring(2, 5);

		return { date: date, time: time, timeStr: timeStr };
	},

	_isEventFull: function(i) {
		if (this.props.venueCaps[i]) return (this.props.venueCaps[i] * 3 <= this.props.totalRsvps[i]) ? true : false;
		return (this.state.defaultVenueSize <= this.props.totalRsvps[i]) ? true : false;
	},

	render: function() {
		var itemNodes = this.props.eventTitles.map( (title, i) => {
			var dateObj = this._getTime(i);
			var isFull = this._isEventFull(i);
			var isRsvpd = this.props.rsvpdEvents[i];
			var checkbox = (isFull || isRsvpd) ? (isRsvpd) ? (<span>RSVP'd</span>) : (<span>Event FULL</span>) : (<input type='checkbox' key={i} onChange={this._toggleCheckbox.bind(this, i)} />);

					  return (
						  <li key={i} className='list-group-item row'>
						  <div className='col-md-2 when'>
						  <div className='date'><span>{ dateObj.date }</span></div>
						  </div>
						  <div className='col-md-7 event-title'><span> { title }</span></div>
						  <div>{checkbox}</div>
						  </li>
					  );
		});

		return(
			<div>
			<div className='col-md-8 events'>
			<h2>UPCOMING EVENTS</h2>
			<div className='list-group panel'>
			{itemNodes}
			</div>
			<button className='btn' onClick={this._getRSVP}>RSVP</button>
			</div>
			</div>
		)
	}
});


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
