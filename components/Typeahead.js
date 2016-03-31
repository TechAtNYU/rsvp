import React, { PropTypes } from 'react';

function Typeahead({ skills, filtered, filterHandler }) {
	const width = '200px';
    return (
    	<div>
		    <input width={width} onChange={e => filterHandler(e.target.value)} type='text'></input>
		    { filtered.length > 0 ? (
		    	<div>
		    	{filtered.map(el =>
		    		<div width={width}>{el.attributes.name}</div>
		    		)}
		    	</div>
		    	): null}
		</div>
	)
}

Typeahead.propTypes = {
	skills: PropTypes.array.isRequired,
	filtered: PropTypes.array.isRequired,
}

export default Typeahead
