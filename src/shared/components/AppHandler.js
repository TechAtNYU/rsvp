import React from "react";

class DropDownMenu extends React.Component {
  constructor() {
    super();
    this.state = { checked: false };
  }

  _toggleCheckbox() {
    console.log('wut');
  }

  render() {
    return(
      <div>
      <div className="col-md-6">
      <h3 className="text-center">Basic Example</h3>
      <div className="well">
      <div className="list-group">
      <div className="list-group-item" onClick={ this._toggleCheckbox }><input checked={this.state.checked} type="checkbox"/> Hi</div>
      <div className="list-group-item" onClick={ this._toggleCheckbox }><input checked="true" type="checkbox"/> Hi</div>
      <div className="list-group-item" onClick={ this._toggleCheckbox }><input checked="true" type="checkbox"/> Hi</div>
      <div className="list-group-item" onClick={ this._toggleCheckbox }><input checked="true" type="checkbox"/> Hi</div>
      <div className="list-group-item" onClick={ this._toggleCheckbox }><input checked="true" type="checkbox"/> Hi</div>
      <div className="list-group-item" onClick={ this._toggleCheckbox }><input checked="true" type="checkbox"/> Hi</div>
      </div>
      </div>
      </div>
      </div>
    )
  }
}


export default class AppHandler extends React.Component {
  constructor() {
    super();

  }
  
  _jsonpCalback(result) {
    console.log(result);
  }

  componentDidMount() {
    $.getJSON("https://api.tnyu.org/v2/people/me")
      .done(function(user) {
        console.log(user);
      });
  }

  render() {
    return (
      <div>
      <DropDownMenu />
      </div>

    );
  }
}
