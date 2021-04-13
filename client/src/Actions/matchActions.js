import * as constants from '../Constants';

export const getCurrentMatch = (match) => ({
    type: constants.GET_CURRENT_MATCH,
    payload: match,
})

export const setAllMatches = (matches) => (
    {
    type: constants.SET_ALL_MATCHES,
    payload: matches,
})