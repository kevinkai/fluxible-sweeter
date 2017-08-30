/* eslint-disable all, no-param-reassign */

const users = [];
// When the user disconnects.. perform this
function onDisconnect() {
  // TODO
}

// When the user connects.. perform this
function onConnect(socket, name) {
  // When the client emits 'info', this listens and executes
  console.log(name, 'socket is connected');

  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  socket.on('messages', msgObj => {
    socket.emit(msgObj.userId, 'dsadasdas')
    // usernames.forEach(username => {
    //   console.log(username, 'is connected =====>');
    //   socket.on(`user:${username}`, msg => {
    //     console.log(username, '======  received a message  =======', msg);
    //   });
    // });
  });

  // Insert sockets below require('../api/thing/thing.socket').register(socket);
}

export default (socketio) => {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: 'sweeter-secret',
  //   handshake: true
  // }));

  socketio.on('connection', (socket) => {
    socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;

    console.log(socket.request.session, '#########');
    socket.connectedAt = new Date();

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    onConnect(socket, 'main');
    socket.log('CONNECTED');
  });
};
