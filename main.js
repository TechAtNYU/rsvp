  var MenuItem = React.createClass({
    getInitialState: function() {
      return { checked: false };
    },

    _toggleCheckbox: function() {
      var ret = (this.state.checked) ? false: true;
      this.setState({
        checked: ret
      });
    },

    render: function() {
      return(
        <div className="list-group-item event-list-item" onClick={this._toggleCheckbox} >
        <input type="checkbox" checked={ this.state.checked } />
        {this.props.title }</div>
      );
    }
  });

  var DropDownMenu = React.createClass({
    render: function() {
      var itemNodes = this.props.events.map( (event) => {
        return (
          <MenuItem title={event.attributes.title} />
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
        </div>
      )
    }
  });


  var AppHandler = React.createClass({
    getInitialState: function() {
      return {
        events: [],
        userId: ''
      };
    },

    componentDidMount: function() {
      // $.getJSON('https://api.tnyu.org/v2/people/me')
      //   .done( function(user) {
      //     console.log(user.data);
      //   });

      $.getJSON('https://api.tnyu.org/v2/events/next-10-publicly')
      .done( (json) => {
        this.setState({
          events: json.data
        });
      });
    },

    render: function() {
      return (
        <div>
        <DropDownMenu events={this.state.events}/>
        </div>
      );
    }
  });

  React.render(<AppHandler />, document.getElementById('app'));
