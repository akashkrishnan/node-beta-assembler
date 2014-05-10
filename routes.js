var Config = require('./config.js');

module.exports = function (app, sockets) {

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('*', function (req, res) {
    res.send(404);
  });

};
