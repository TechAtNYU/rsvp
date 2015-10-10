var EmailNode = React.createClass({
  render: function() {
    var emailNode = (this.props.exists) ? (
        <div>
          <p>Is this your preferred email?</p>
          <p id="user_email">{this.props.email}</p>
          <button className="btn btn-sm" onClick={this.props._toChangeEmail}>Change my email (optional)</button>
        </div>
      ) : (
        <div className="email-field col-md-12">
          <div className="col-md-4"><span>Email: </span></div>
          <div className="col-md-5"><input type="text" onChange={this.props._onEmailInput} /></div>
        </div>
      );
    return emailNode;
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
      <div className="nNumber-field col-md-12">
        <div className="col-md-4"><span>N-Number (if NYU student): </span></div>
        <div className="col-md-5"><input defaultValue="N" type="text" onChange={this._onNNumberInput} /></div>
      </div>
    ): null;

    var submitBtn = ((!this.props.nNumberExists) || (!this.props.emailExists) || this.state.changeEmail) ? (
      <div className="col-md-offset-6">
        <button onClick={this.props._onUserStatSubmit.bind(null, this.state.email, this.state.nNumber)} className="btn btn-md">Done</button>
      </div>
    ): null;

    var comment = ((!this.props.nNumberExists)||(!this.props.emailExists)) ? (
      <p className="user-stat-comment">Oops. It looks like you are missing some info in your RSVP.</p>
    ): (this.state.changeEmail) ? <p className="user-stat-comment">Fill in your new email.</p> : null;

    return (
      <div className="user-stat well col-md-8 col-md-offset-2">
       <div id="user-stat-close" onClick={this.props._onCloseWindow}>Close</div>
        {comment}
        {emailNode}
        {nNumberNode}
        {submitBtn}
      </div>
    )
  }
});

var DropDownMenu = React.createClass({
  getInitialState: function() {
    return {
      selectedEvents: {},
    };
  },

  _getRSVP: function() {
    var selected = this.state.selectedEvents;
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

    selected[id] = (id in selected) ? (selected[id] === true) ? false: true : true;

    this.setState({ selectedEvents: selected });
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
      finishUserStatSubmit: false
    };
  },

  componentWillMount: function() {
    $.getJSON('https://api.tnyu.org/v2/people/me')
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
    this.setState({ rsvpComplete: true });
  },

  _onFinishUserStat: function() { this.setState({ finishUserStatSubmit: true }); },

  _onUserStatSubmit: function(email, nNumber) {
    var id = this.state.userId;
    var data = { 
      "data": {
        "type": "people",
        "id": id,
        "attributes": {
          "contact": {
          }
        }
      }
    }

    if (email || nNumber) {
      if (email) data.data.attributes.contact["email"] = email;
      if (nNumber) data.data.attributes["nNumber"] = nNumber;

      $.ajax({
        type: 'PATCH',
        acccepts: 'application/vnd.api+json, application/*, */*',
        contentType: 'application/vnd.api+json; ext=bulk',
        url: 'https://api.tnyu.org/v2/people/me',
        crossDomain: true,
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }
    this._onFinishUserStat();
  },

  render: function() {
    var loginNode = (
      <div className="fb-login">
      <button className="btn btn-primary btn-lg text-center" onClick={this._loginWithFacebook}>Login with Facebook</button>
      </div>
    );
    
    var userStatNode = (!this.state.finishUserStatSubmit) ? <UserStat _onUserStatSubmit={this._onUserStatSubmit} emailExists={this.state.emailExists} email={this.state.email} nNumberExists={this.state.nNumberExists} _onCloseWindow={this._onFinishUserStat} /> : null;


    var dropDownNode = (
      <div>
        {userStatNode}
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
