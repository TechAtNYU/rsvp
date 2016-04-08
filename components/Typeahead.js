import React, { PropTypes } from 'react';

function Typeahead({ domId, title, value, fieldType, width, list, filtered, selected, filterHandler, keyPressHandler, currentIdx, deleteSelection }) {
	if (list.length === filtered.length + selected.length) filtered = [];
    return (
    	<div className='container'
    		domId={domId}>
    		<div className='row'>
	    		<label>{title}</label>
    		</div>
    		<div className='row'>
			    <input type='text' style={{
			    	width: width
			    }}
			    onKeyUp={ e => keyPressHandler(e.which, fieldType)}
			    onChange={e => filterHandler(e.target.value)}
			    defaultValue=''
			    value={value}
			    type='text'></input>
		    { filtered.length > 0 ? (
		    	<div style={{position: 'fixed', zIndex: '10'}}>
		    	{filtered.map((el, i) =>
		    		<div style={{
		    			border: '1px solid lightgray',
		    			width: width,
		    			position: 'relative',
		    			display: 'block',
		    			backgroundColor: (currentIdx === i) ? 'lightblue': 'white',
		    	}} key={i}>{el.attributes.name}</div>
		    		)}
		    	</div>
		    	): null}
		    </div>
		    <div style={{
		    	display: 'flex',
		    	flexDirection: 'row',
		    	flexWrap: 'wrap',
		    	justifyContent: 'flex-start',
		}}>
		    <span>Selected: </span>
		    { selected.map( (el, i) =>
		    	<div
		    		key={i}
			    	style={{
			    		border: '1px solid lightgray',
			    		borderRadius: '10px',
			    		backgroundColor: 'white',
			    		width: 'auto',
				    	height: '28px',
				    	lineHeight: '28px',
			    		marginRight: '2px',
			    		marginLeft: '2px',
			    		paddingRight: '8px',
			    		paddingLeft: '8px',
			    		alignSelf: 'center',
			    	}}
			    	onClick={ _ => deleteSelection(i)}>
			    	{el.attributes.name}
		    	</div>
		    	)}
		    </div>
		</div>
	)
}

Typeahead.propTypes = {
	title: PropTypes.string.isRequired,
	list: PropTypes.array.isRequired,
	filtered: PropTypes.array.isRequired,
	currentIdx: PropTypes.number.isRequired,
	filterHandler: PropTypes.func.isRequired,
	keyPressHandler: PropTypes.func.isRequired,
	deleteSelection: PropTypes.func.isRequired,
}

export default Typeahead
