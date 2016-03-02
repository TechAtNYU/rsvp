import React from 'react';
import VisibleEventList from '../containers/VisibleEventList';
import Welcome from '../containers/Welcome'

function App({store}) {
    return <div>
	<Welcome />
	<VisibleEventList />
    </div>

}

export default App;
