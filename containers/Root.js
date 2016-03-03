import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import { fetchAll } from '../actions'
import App from './App'

const store = configureStore()

store.dispatch(fetchAll())

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
		        	<App />
		      </Provider>
        )
    }

}