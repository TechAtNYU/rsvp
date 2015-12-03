var React = require('react');

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

module.exports = Typeahead;
