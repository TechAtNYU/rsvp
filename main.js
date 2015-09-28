var DropDownMenu = React.createClass({
  getInitialState: function() {
    return {
      selectedEvents: {},
      rsvpComplete: false
    };
  },

  _getRSVP: function() {
    var selected = this.state.selectedEvents;
    this.props.eventIds.map(function(id, i) {
      if (selected[id]) { 
        $.ajax({
          type: "GET",
          acccepts: 'application/vnd.api+json, application/*, */*',
          ContentType: 'application/vnd.api+json; ext=bulk',
          url: "https://api.tnyu.org/v2/events/" + id + "/rsvp",
          async: false,
          dataType: "jsonp",
          success: function(data) {console.log(data); },
          error: this.props._onRsvpFailed(err, id)
        });
      }
    });
    this.props._onRsvpCompleted();
  },


  _handleChange: function(i) {
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

  render: function() {
    var itemNodes = this.props.eventTitles.map( (title, i) => {
      var date = this.props.eventStartDates[i].substring(0, 10);
      var time = this.props.eventStartDates[i].substring(11, 16);
      var det = parseInt(time.substring(0, 2));
      var timeStr = (det < 12) ? "AM": "PM";

      return (
        <li key={i} className="list-group-item event-list-item row">
          <div className="col-md-1"><input type="checkbox" key={i} onChange={this._handleChange.bind(this, i)} /></div>
          <div className="col-md-7"><span> { title }</span></div>
          <div className="col-md-2"><span>{ date }</span></div>
          <div className="col-md-2"><span>{ time } { timeStr }</span></div>
        </li>
      );
    });

    return(
      <div>
        <h3 className="text-center">Tech@NYU: RSVP for Events</h3>
        <div className="well col-md-8 col-md-offset-2">
          <div className="list-group panel">
          {itemNodes}
          </div>
        </div>
        <div className="col-md-1 col-md-offset-2">
          <button onClick={this._getRSVP}>RSVP</button>
        </div>
      </div>
    )
  }
});


var AppHandler = React.createClass({
  getInitialState: function() {
    return {
      userId: '',
      eventTitles: [],
      eventIds: [],
      eventStartDates: [],
      rawJson: [],
      nNumber: false,
      email: '',
      rsvpComplete: false,
      rsvpFailed: false
    };
  },

  componentWillMount: function() {
    $.getJSON('https://api.tnyu.org/v2/people/me')
      .done( (user) => {
        // user is logged in
        var nNumberExist = ('nNumber' in user.data.attributes) ? true: false;

        this.setState({
          userId: user.data.id,
          nNumber: nNumberExist
        });

        $.getJSON('https://api.tnyu.org/v2/events/next-10-publicly')
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
      .fail((err) => {
        // redirect to login
        var url = 'https://api.tnyu.org/v2/auth/facebook?success=' + window.location;
        window.location.href = url;
      });

  },

  _onRsvpCompleted: function() {
    this.setState({
      rsvpComplete: true
    });
  },

  _onRsvpFailed: function(err, id) {
    console.log('RSVP for event ' + id + 'failed. Please try again later.');
    console.log(err);
    this.setState({
      rsvpFailed: true
    });
  },

  render: function() {
    var dropDownNode = (
      <DropDownMenu eventTitles={this.state.eventTitles} eventIds={this.state.eventIds} eventStartDates={this.state.eventStartDates} rawJson={this.state.rawJson} _onRsvpCompleted={this._onRsvpCompleted} _onRsvpFailed={this._onRsvpFailed} />
    );

    var rsvpDoneNode = (
      <h1>RSVP completed. Remember to check-in at the event! Thanks!</h1>
    )

    var rsvpFailedNode = (
      <h1>RSVP failed. Please try again later.</h1>
    );

    var renderNode = (this.state.rsvpFailed) ? rsvpFailedNode:  (this.state.rsvpComplete) ? rsvpDoneNode: dropDownNode;

    return (
      <div>
      {renderNode}
      </div>
    );
  }
});

React.render(<AppHandler />, document.getElementById('app'));
