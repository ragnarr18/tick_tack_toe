import io from 'socket.io-client';

//now you can use socket.connect() to connect, because not automatic
const socket = io('localhost:8080', { autoConnect: false});


export default function socketReducer(state= socket, action){
    return state;
}