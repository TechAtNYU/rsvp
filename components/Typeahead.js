import React, { PropTypes } from 'react';

function Typeahead({ domId, title, value, fieldType, width, list, filtered, selected, filterHandler, keyPressHandler, onHover, currentIdx, deleteSelection }) {
	if (list.length === filtered.length + selected.length) filtered = [];
    return (
    	<div className='container'
    		id={domId}>
    		<div className='row'>
	    		<label>{title}</label>
    		</div>
    		<div>
			    <input type='text' style={{
			    	width: width,
			    }}
			    onKeyUp={ e => keyPressHandler(e.which)}
			    onChange={e => filterHandler(e.target.value)}
			    defaultValue=''
			    value={value}
			    type='text'></input>
		    { filtered.length > 0 ? (
		    	<div style={{
		    		overflowY: 'scroll',
		    		position: 'absolute',
		    	}}>
		    	{filtered.map((el, i) =>
		    		<div style={{
		    			border: '1px solid lightgray',
		    			width: width,
		    			zIndex: '10',
		    			position: 'relative',
		    			textAlign: 'center',
		    			backgroundColor: currentIdx === i ? 'lightblue': 'white'}}
		    			key={i}
		    			onMouseOver={ _ => onHover(i)}
						onClick={ _ => keyPressHandler(13)}
		    			>
		    			{el.attributes.name}
		    			</div>
		    		)}
		    	</div>
		    	): null}
		    </div>
			<div style={{
				marginTop: '10px',
				display: '-webkit-box',
  				display: '-moz-box',
  				display: '-ms-flexbox',
  				display: '-moz-flex',
  				display: '-webkit-flex',
				display: 'flex',
			  	WebkitFlexWrap: 'wrap',
			  	flexWrap: 'wrap',
			}}>
			{ selected.length > 0 ? <span>Selected: </span>: null}
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
						margin: '2px 2px 2px 2px',
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
	onHover: PropTypes.func.isRequired,
}

export default Typeahead
