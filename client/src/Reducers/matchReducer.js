import * as constants from '../Constants';

const init = {
    matches: [],
    currentMatch: {},
}

function getCurrent(state,id){
    let current = state.matches.find(m => m.matchId === id);
    if(current === undefined){
        return {};
    }
    return current;
}

export default function matchReduer(state=init, action){
    switch(action.type){
        // case constants.GET_CURRENT_MATCH:
        //     return {...state, currentMatch: getCurrent(state,action.payload) }
        case constants.SET_ALL_MATCHES:
            console.log("reducer: " , action.payload);
            return {...state, matches: action.payload}
        default: return state;
    }
}