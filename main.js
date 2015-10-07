var DropDownMenu = React.createClass({
  getInitialState: function() {
    return {
      selectedEvents: {},
      rsvpComplete: false
    };
  },

  _getRSVP: function() {
    var selected = this.state.selectedEvents;
    var total = this.props.eventIds.length;
    var len = Object.keys(selected).length;
    this.props.eventIds.map(function(id, i) {
      if (selected[id]) { 
        $.ajax({
          type: "GET",
          acccepts: 'application/vnd.api+json, application/*, */*',
          ContentType: 'application/vnd.api+json; ext=bulk',
          url: "https://api.tnyu.org/v2/events/" + id + "/rsvp",
          async: false,
          dataType: "jsonp",
          success: function(data) { console.log(data.status); },
        });
      }
    });
    if (len > 0) this.props._onRsvpCompleted();
  },

  _toggleCheckbox: function(i) {
    var id = this.props.eventIds[i];
    var selected = this.state.selectedEvents;

    if (id in selected) {
      // toggle checkbox
      selected[id] = (selected[id]) ? false: true;
    } else {
      selected[id] = true;
    }
    this.setState({
      selectedEvents: selected
    });
  },

  _getTime: function(i) {
    var date = this.props.eventStartDates[i].substring(0, 10);
    var time = this.props.eventStartDates[i].substring(11, 16);
    var det = parseInt(time.substring(0, 2));
    var timeStr = (det < 12) ? "AM": "PM";

    return { date: date, time: time, timeStr: timeStr };

  },

  render: function() {
    var itemNodes = this.props.eventTitles.map( (title, i) => {
      var dateObj = this._getTime(i);

      return (
        <li key={i} className="list-group-item event-list-item row">
        <div className="col-md-1"><input type="checkbox" key={i} onChange={this._toggleCheckbox.bind(this, i)} /></div>
        <div className="col-md-7"><span> { title }</span></div>
        <div className="col-md-2"><span>{ dateObj.date }</span></div>
        <div className="col-md-2"><span>{ dateObj.time } { dateObj.timeStr }</span></div>
        </li>
      );
    });

    return(
      <div>
        <div className="well col-md-8 col-md-offset-2">
          <div className="list-group panel">
          {itemNodes}
          </div>
        </div>
        <div className="col-md-1 col-md-offset-2">
        <button className="btn" onClick={this._getRSVP}>RSVP</button>
        </div>
      </div>
    )
  }
});

var UserStat = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      nNumber: ''
    }
  },

  _onEmailInput: function(e) {
    this.setState({
      email: e.target.value
    })
  },

  _onNNumberInput: function(e) {
    this.setState({
      nNumber: e.target.value.substring(0, 140)
    });
  },

  render: function() {
    var emailNode, nNumberNode, submitBtn;

    if (this.props.emailExists) {
      emailNode = (
        <div>
        <p>Is this your preferred email? (optional)</p>
        <p>{this.props.email}</p>
        <button>Change my email</button>
        </div>
      );
    } else {
      emailNode = (
        <div className="email-field col-md-12">
          <div className="col-md-3"><span>Email: </span></div>
          <div className="col-md-5"><input type="text" onChange={this._onEmailInput} /></div>
        </div>
      );
    }

    if (!this.props.nNumberExists) {
      nNumberNode = (
        <div className="nNumber-field col-md-12">
          <div className="col-md-3"><span>N-Number (if NYU): </span></div>
          <div className="col-md-5"><input defaultValue="N" type="text" onChange={this._onNNumberInput} /></div>
        </div>
      );
    }

    if ((!this.props.nNumberExists) || (!this.props.emailExists)) {
      submitBtn = (
        <div className="col-md-offset-4"><button onClick={this.props._onUserStatSubmit.bind(null, this.state.email, this.state.nNumber)} className="btn btn-sm col-md-1">Done</button></div>
      );
    }

    return (
      <div className="user-stat well col-md-8 col-md-offset-2">
      {emailNode}
      {nNumberNode}
      {submitBtn}
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
      eventTitles: [],
      eventIds: [],
      eventStartDates: [],
      rawJson: [],
      rsvpComplete: false,
      emailUpdate: false
    };
  },
  componentWillMount: function() {
    $.getJSON('https://api.tnyu.org/v2/people/me')
    .done( (user) => {
      // user is logged in
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

      $.getJSON('https://api.tnyu.org/v2/events/next-10-publicly?page%5Blimit%5D=10&sort=%2bstartDateTime')
      .done( (json) => {

        var eventIds = json.data.map(function(event) { return event.id; });
        var eventTitles = json.data.map(function(event) { return event.attributes.title; });
        var eventStartDates = json.data.map(function(event) { return event.attributes.startDateTime; });

        this.setState({
          eventTitles: eventTitles,
          eventIds: eventIds,
          eventStartDates: eventStartDates,
          rawJson: json.data
        });
      });
    })
  },

  _loginWithFacebook: function() {
      var url = 'https://api.tnyu.org/v2/auth/facebook?success=' + window.location;
      window.location.href = url;
  },

  _onRsvpCompleted: function() {
    this.setState({
      rsvpComplete: true
    });
  },

  _getPatchObj: function() {
    var id = this.state.userId;
    if (!this.state.nNumberExists) var nNumber = this.state.nNumber;
    if (this.state.emailUpdate)
    return {
      "data": {
        "type": "people",
        "id": id,
        "attributes": {
          "nNumber": nNumber,
          "email": email
        }
      }
    }
  },

  _onUserStatSubmit: function(email, nNumber) {
    var emailUpdated = (email) ? true : false
    this.setState({
      emailExists: true,
      nNumberExists: true,
      email: email,
      nNumber: nNumber,
      emailUpdate: emailUpdated
    });

    var data = JSON.stringify(this._getPatchObj());

    $.ajax({
      type: 'PATCH',
      acccepts: 'application/vnd.api+json, application/*, */*',
      ContentType: 'application/vnd.api+json; ext=bulk',
      url: 'https://api.tnyu.org/v2/people/me',
      async: false,
      dataType: "jsonp",
      data: data,
      success: function(data) { console.log(data); },
    });
  },

  render: function() {
    var loginNode = (
      <button className="btn btn-primary btn-lg" onClick={this._loginWithFacebook}>Login with Facebook</button>
    );

    var dropDownNode = (
      <div>
        <UserStat _onUserStatSubmit={this._onUserStatSubmit} emailExists={this.state.emailExists} email={this.state.email} nNumberExists={this.state.nNumberExists} />
        <DropDownMenu eventTitles={this.state.eventTitles} eventIds={this.state.eventIds} eventStartDates={this.state.eventStartDates} rawJson={this.state.rawJson} _onRsvpCompleted={this._onRsvpCompleted} />
      </div>
    );

    // different DISPLAY nodes for different state
    var rsvpDoneNode = (
      <h1>RSVP completed. Remember to check-in at the event! Thanks!</h1>
    )

  var renderNode = (this.state.rsvpComplete) ? rsvpDoneNode: (this.state.loggedIn) ? dropDownNode : loginNode;

  return (
    <div className="main">
      <p className="heading text-center">Tech@NYU: RSVP for Events</p>
      <div>
      {renderNode}
      </div>
    </div>
  );
  }
});

React.render(<AppHandler />, document.getElementById('app'));
