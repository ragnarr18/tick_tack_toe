import * as constants from '../Constants/';

export default function sessionReducer(state={}, action){
    switch(action.type){
        case constants.ADD_SESSION:
            const { sessionID, userID, username } = action.payload;
            localStorage.setItem('s.id', sessionID);
            localStorage.setItem('u.id', userID);
            localStorage.setItem('u.name', username);
            return action.payload;
        case constants.REMOVE_SESSION:
            localStorage.clear();
            return action.payload;
        case constants.GET_SESSION:
            const sId = localStorage.getItem('s.id');
            const uId = localStorage.getItem('u.id');
            const uName = localStorage.getItem('u.name');
            return ({sessionID: sId, userID: uId, username: uName});
        default: return state;
    }
}