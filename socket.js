var Config = require('./config.js');
var Assembler = require('./models/assembler.js');

module.exports = function (sockets) {
  return function (socket) {
    publicIO(socket, sockets);
  }
};

// Socket events for any user
function publicIO(socket, sockets) {

  // Assemble event from client
  socket.on('assemble', function (assembly) {
    Assembler.assemble(assembly, function (err, result) {
      if (err) console.warn(err);
      socket.emit('assemble', {err: err, result: result});
    });
  });

}
