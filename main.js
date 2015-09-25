var DropDownMenu = React.createClass({
  getInitialState: function() {
    return {
      selectedEvents: {}
    };
  },

  _getRSVP: function(event) {
    event.preventDefault();
    this.props.eventIds.map(function(id, i) {
      $.ajax({
        type: "POST",
        url: "https://api.tnyu.org/v2/events/" + id + "/check-in",
        async: false,
        success: function(data) { console.log(data); },
        error: function(err) { console.log(err); }
      });

    });
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
        <input className="col-md-1" type="checkbox" key={i} onChange={this._handleChange.bind(this, i)} />
            <span className="col-md-7"> { title }</span>
            <span className="col-md-2">{ date }</span>
            <span className="col-md-2">{ time } { timeStr }</span>
        </li>
      );
    });

    return(
      <div className="col-md-8">
        <h3 className="text-center">Tech@NYU: RSVP for Events</h3>
        <div className="well">
          <ul className="list-group">
          {itemNodes}
          </ul>
        </div>

      <button onClick={this._getRSVP}>RSVP</button>
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
      rawJson: []
    };
  },

  componentWillMount: function() {
    $.getJSON('https://api.tnyu.org/v2/people/me')
      .done( (user) => {
        this.setState({
          userId: user.data.id
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
        console.log(err);
      });

  },

  render: function() {
    return (
      <div>
      <DropDownMenu eventTitles={this.state.eventTitles} eventIds={this.state.eventIds} eventStartDates={this.state.eventStartDates} rawJson={this.state.rawJson}/>
      </div>
    );
  }
});

React.render(<AppHandler />, document.getElementById('app'));
