const httpServer = require("http").createServer();
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(16).toString("hex");
const PORT = process.env.PORT || 8080;
const io = require("socket.io")(httpServer, {
  cors: {
    // origin: "https://sleepy-pasteur-f53d2b.netlify.app/",
    origin: '*',
  },
});

// Session store
const { InMemorySessionStore } = require("./stores/sessionStore");
const sessionStore = new InMemorySessionStore();

// Store the matches
const matches = {};
const availableSymbols = ['X', 'O'];

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  if (sessionStore.isUsernameOccupied(username)) {
    return next(new Error("occupied"));
  }

  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

const getListOfUsers = () => {
  const sessions = sessionStore.findAllSessions();
  const users = [];

  sessions.forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected
    });
  });
  return users;
}

const getListOfMatches = () => {
  const matchList = [];
  Object.keys(matches).forEach(matchId => {
    const currentMatch = matches[matchId];
    const { isOngoing } = currentMatch;
    const participants = currentMatch.participants;
    const winner = participants.find(p => p.userID === currentMatch.winner);
    matchList.push({
      matchId,
      participants,
      winner,
      isOngoing
    });
  });
  return matchList;
};

const getSocketByUserId = async userId => {
  const sockets = Array.from(await io.allSockets());
  const socketId = sockets.find(
    (socketId) => io.sockets.sockets.get(socketId).userID === userId,
  );
  if (!socketId) { return null; }
  return io.sockets.sockets.get(socketId);
}

const associateSocketWithMatch = socket => {
  Object.keys(matches).forEach(matchKey => {
    const currentMatch = matches[matchKey];
    if (currentMatch.participants.find(p => p.userID === socket.userID)) {
      socket.join(matchKey);
    }
  });
};

io.on('connection', socket => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username
  });

  socket.join(socket.userID);
  associateSocketWithMatch(socket);

  console.log(`Connected as ${socket.username}`);

  // Broadcast to all users the newly connected user
  socket.broadcast.emit('connected_user', {
    userID: socket.userID,
    username: socket.username,
    connected: socket.connected
  });

  socket.on('users', () => {
    socket.emit('users', getListOfUsers());
  });

  socket.on('matches', () => {
    socket.emit('matches', getListOfMatches());
  });

  socket.on('game_challenge', (toUserId) => {
    const fromUser = sessionStore.findSession(socket.sessionID);
    socket.to(toUserId).emit('game_challenge', { challenger: fromUser });
  });

  socket.on('game_challenge_accepted', async (matchId, toUserId) => {
    const toSocket = await getSocketByUserId(toUserId);
    // console.log("game challenge accepted toUserId, matchId: ", toUserId, matchId);
    // Let both sockets join the room for the match - this will help tremendously to send messages to both sockets
    toSocket.join(matchId);
    socket.join(matchId);

    const firstSymbol = availableSymbols[Math.floor(Math.random() * 2)];

    matches[matchId] = {
      participants: []
    };

    const fromUser = sessionStore.findSession(socket.sessionID);
    const toUser = sessionStore.findSession(toSocket.sessionID);
    const participants = [
      { ...toUser, symbol: firstSymbol },
      { ...fromUser, symbol: firstSymbol === 'X' ? 'O' : 'X' }
    ];

    matches[matchId] = {
      participants,
      isOngoing: true
    }

    // console.log("participants: ", participants);
    
    socket.to(toUserId).emit('game_challenge_accepted', matchId, fromUser);
    io.emit('new_match', {
      matchId,
      participants,
      winner: undefined,
      isOngoing: true
    });
  });

  socket.on('game_challenge_declined', toUserId => {
    const fromUser = sessionStore.findSession(socket.sessionID);
    socket.to(toUserId).emit('game_challenge_declined', fromUser);
  });

  socket.on('ready', matchId => {
    const participant = matches[matchId].participants.find(p => p.userID === socket.userID);
    socket.emit('assign_symbol', participant.symbol);
  });

  socket.on('game_move', (matchId, symbol, idx, isGameWinningMove, isDraw) => {
    // console.log("got game move", matchId, symbol, isGameWinningMove, isDraw);
    if (isDraw) {
      io.emit('match_ended', matchId, null);
      matches[matchId].isOngoing = false;
    }
    else if (isGameWinningMove) {
      matches[matchId].winner = socket.userID;
      matches[matchId].isOngoing = false;
      const winner = matches[matchId].participants.find(p => p.userID === socket.userID)
      io.emit('match_ended', matchId, winner);
    }
    io.to(matchId).emit('game_move', symbol, idx);
  });

  socket.on('leave', () => {
    sessionStore.removeSession(socket.sessionID);
    socket.broadcast.emit('user_left', socket.userID);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.username}`);

    const session = sessionStore.findSession(socket.sessionID);

    if (session) {
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });

      // notify other users
      socket.broadcast.emit('disconnected_user', socket.userID);
    }
  });

});
httpServer.listen(PORT);
