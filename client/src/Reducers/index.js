import { combineReducers } from 'redux';
import socket from './socketReducer';
import session from './sessionReducer';
import matchState from './matchReducer';

export default combineReducers({
    socket,
    session,
    matchState,
})