import React, { PropTypes } from 'react';

function Typeahead({ width, skills, filtered, selected, filterHandler, keyPressHandler, currentIdx, deleteSelection }) {
	if (skills.length === filtered.length + selected.length) filtered = [];
    return (
    	<div>
		    <input style={{
		    	width: width
		    }}
		    onKeyUp={ e => keyPressHandler(e.which)}
		    onChange={e => filterHandler(e.target.value)}
		    type='text'></input>
		    { filtered.length > 0 ? (
		    	<div>
		    	{filtered.map((el, i) =>
		    		<div style={{
		    			border: '1px solid lightgray',
		    			width: width,
		    			backgroundColor: (currentIdx === i) ? 'lightblue': null,
		    	}} key={i}>{el.attributes.name}</div>
		    		)}
		    	</div>
		    	): null}
		    { selected.map( (el, i) =>
		    	<button type='button' key={i}
		    	onClick={ _ => deleteSelection(i)}
		    	className='btn btn-secondary btn-sm'>
		    	{el.attributes.name}
		    	</button>
		    	)}
		</div>
	)
}

Typeahead.propTypes = {
	skills: PropTypes.array.isRequired,
	filtered: PropTypes.array.isRequired,
	currentIdx: PropTypes.number.isRequired,
	filterHandler: PropTypes.func.isRequired,
	keyPressHandler: PropTypes.func.isRequired,
	deleteSelection: PropTypes.func.isRequired,
}

export default Typeahead
