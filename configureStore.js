import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()
window.isDev = true;

const middlewares = (window.isDev) ?
        applyMiddleware(thunkMiddleware, loggerMiddleware):
        applyMiddleware(thunkMiddleware);

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        middlewares
    )
}