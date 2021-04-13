import * as constants from '../Constants';

export const addSession = session => ({
    type: constants.ADD_SESSION,
    payload: session,
})

export const removeSession = () => ({
    type: constants.REMOVE_SESSION,
    payload: {},  
})

export const getSession = () => ({
    type: constants.GET_SESSION,
    payload: {},
})