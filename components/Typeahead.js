import React, { PropTypes } from 'react';
const list = ['interaction design', 'graphic design', 'design thinking', 'illustration', 'design research', 'game design', 'fashion design', 'ruby', 'processing', 'javascript', 'wordpress', 'mongo', 'sql', 'node', 'html/css', 'rails', 'unity', 'angular', 'java', 'python', 'php', 'management', 'marketing', 'statistics', 'machine learning/ai', 'fundraising', 'data visualization', 'product management', 'social media marketing', 'product design', 'game art', 'r', 'd3', 'iOS', 'android', 'objective c', 'scala', 'swift', 'computer vision', 'data journalism', 'due diligence', 'event planning', 'functional programming', 'c#'];

function inpHandle(val) {
	const filtered = list.filter(name => name.slice(0, val.length) === val);
	console.log(filtered);
}

function Typeahead({}) {
    return (
    	<div>
		    <span>TYPEAHEAD</span>
		    <input onChange={e => inpHandle(e.target.value)} type='text'></input>
		</div>
	)
}

Typeahead.propTypes = {
    // nNumber: PropTypes.string.isRequired,
}

export default Typeahead
