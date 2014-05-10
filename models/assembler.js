var Config = require('../config.js');

module.exports = {
  assemble: assemble
};

function assemble(assembly, done) {
  var output = '';
  var lines = assembly.match(/^.*([\n\r]+|$)/gm);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].replace(/[^\S\n]+/g, '');
    output += i + '. ' + lines[i] + '\n';
  }
  done(undefined, output);
}
