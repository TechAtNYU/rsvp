var React = require('react');
var Typeahead = require('./Typeahead.js');

var SkillPanel = React.createClass({
	getInitialState: function() {
		return {
			skillList: [],
			skillNameList:[]
		}
	},
	componentWillMount: function() {
		$.getJSON('https://api.tnyu.org/' + window.API_VERSION + '/skills')
		.then((skillList) => {
			var skillNameList = [];
			var transformedSkillList = skillList.data.map((skill) => {
				skillNameList.push(skill.attributes.name);
				return {
					id: skill.id,
					name: skill.attributes.name,
					category: skill.attributes.category
				}
			});
			this.setState({ skillList: transformedSkillList, skillNameList: skillNameList});
		});
	},
	render: function() {
		return (
			<div>
			<span>What are your skills? If you are interested, we are collecting people's skillset to do things like, match you up to someone to build a project if you are interested, create better events that match your interests/skills, etc.</span>
			<Typeahead options={this.state.skillNameList}/>
			</div>
		)
	}
});

module.exports = SkillPanel;

