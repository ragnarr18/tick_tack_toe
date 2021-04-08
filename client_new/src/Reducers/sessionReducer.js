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
            console.log("clearing localstorage");
            localStorage.clear();
            return action.payload;
        default: return state;
    }
}