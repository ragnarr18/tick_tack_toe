import connectToSocketIOServer from 'socket.io-client';
const socket = connectToSocketIOServer('http://localhost:8080/');

const socketServices = () => ({
    auth: (username) => socket.auth = {username: username},
    // getUsers: () => socket.on("users", (users) => {console.log(users)})
})

export default socketServices();