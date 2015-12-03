var React = require('react');

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
		var newTime = parseInt(time.substring(0, 2)) - 5;
        if (newTime > 12) newTime -= 12;
        time = newTime.toString() + time.substring(2, 5);

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
						  <div className='date'>
                              <p>{dateObj.date}</p>
                              <p>{dateObj.time + dateObj.timeStr}</p>
                          </div>
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

module.exports = DropDownMenu;
