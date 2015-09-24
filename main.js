var DropDownMenu = React.createClass({
  getInitialState: function() {
    return {
      selectedEvents: {}
    };
  },

  _getRSVP: function(event) {
    event.preventDefault();
  },

  _handleChange: function(i) {
    var id = this.props.eventIds[i];
    var selected = this.state.selectedEvents;

    if (id in selected) {
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
      return (
        <div key={i} className="list-group-item event-list-item">
        <input type="checkbox" key={i} onChange={this._handleChange.bind(this, i)} />
        <span> { title }</span>
        </div>
      );
    });

    return(
      <div className="col-md-6">
        <h3 className="text-center">Basic Example</h3>
          <div className="well">
            <div className="list-group">
              {itemNodes}
            </div>
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
      rawJson: []
    };
  },

  componentWillMount: function() {
    // $.getJSON('https://api.tnyu.org/v2/people/me')
    //   .done( function(user) {
    //     console.log(user.data);
    //   });

    $.getJSON('https://api.tnyu.org/v2/events/next-10-publicly')
    .done( (json) => {
      var eventIds = json.data.map(function(event) { return event.id; });
      var eventTitles = json.data.map(function(event) { return event.attributes.title; });
      this.setState({
        eventTitles: eventTitles,
        eventIds: eventIds,
        rawJson: json.data
      });
    });
  },

  render: function() {
    return (
      <div>
      <DropDownMenu eventTitles={this.state.eventTitles} eventIds={this.state.eventIds} rawJson={this.state.rawJson}/>
      </div>
    );
  }
});

React.render(<AppHandler />, document.getElementById('app'));
