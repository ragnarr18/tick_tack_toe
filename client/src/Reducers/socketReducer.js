import io from 'socket.io-client';

//now you can use socket.connect() to connect, because not automatic
const socket = io('https://immense-ridge-41275.herokuapp.com/', { autoConnect: false});


export default function socketReducer(state= socket, action){
    return state;
}