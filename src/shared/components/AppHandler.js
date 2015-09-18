import React from "react";

class MenuItem extends React.Component {
    constructor() {
      super();
      this.state = {
        checked: false
      };
    }

    _toggleCheckbox() {
      let ret = (this.state.checked) ? false: true;
      this.setState({
        checked: ret
      });
    }

    render() {
      return(
        <div className="list-group-item event-list-item" onClick={this._toggleCheckbox.bind(this)} ><input type="checkbox" checked={ this.state.checked }/> {this.props.title }</div>
      );
    }
}

class DropDownMenu extends React.Component {
  constructor() {
    super();
  }


  render() {
    let itemNodes = this.props.events.map( (event) => {
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
}


export default class AppHandler extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      userId: ''
    };
  }
  
  componentDidMount() {
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
  }

  render() {
    return (
      <div>
      <DropDownMenu events={this.state.events}/>
      </div>
    );
  }
}
