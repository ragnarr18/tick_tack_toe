import * as constants from '../Constants';

const init = {
    matches: [],
    currentMatch: {},
}

export default function matchReduer(state=init, action){
    switch(action.type){
        case constants.SET_ALL_MATCHES:
            return {...state, matches: action.payload}
        default: return state;
    }
}