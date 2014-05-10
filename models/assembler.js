var Config = require('../config.js');

module.exports = {
  assemble: assemble
};

function assemble(assembly, done) {
  var output = '';
  var nBytes = 4;
  if (assembly) {
    var labels = getRegs(32);
    var lines = assembly.replace(/[^\S\n]+/g, '').match(/[^\r\n]+/g);
    var l = 0;
    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];

      // Regex
      var label = /^([a-zA-Z0-9_]+):$/;
      var variable = /^([a-zA-Z0-9_]+)=([a-zA-Z0-9_]+)$/;
      var OP = /^([a-zA-Z0-9_]+)\(([a-zA-Z0-9_]+),([a-zA-Z0-9_]+),([a-zA-Z0-9_]+)\)$/

      // Process line
      if (label.test(line)) {

        // Tokenize
        var tokens = label.exec(line);

        // Extract tokens
        var label = tokens[1];

        output += label + ' <- ' + l + '\n';

        if (labels[label] !== undefined) output += 'ERROR: Label already exists.\n';
        else labels[label] = l;

      } else if (variable.test(line)) {

        // Tokenize
        var tokens = variable.exec(line);

        // Extract tokens
        var label = tokens[1];
        var value = tokens[2];

        output += label + ' <- ' + labels[value] + '\n';

        if (labels[label] !== undefined) output += 'ERROR: Label already exists.\n';
        else if (labels[value] === undefined) output += 'ERROR: Value doesn\'t exist.\n';
        else labels[label] = labels[value];

      } else if (OP.test(line)) {

        // Tokenize
        var tokens = OP.exec(line);

        // Extract tokens
        var OP = tokens[1];
        var Ra = tokens[2];
        var Rb = tokens[3];
        var Rc = tokens[4];

        output += l + ': ' + OP + '(' + labels[Ra] + ',' + labels[Rb] + ',' + labels[Rc] + ')\n';
        l++;

      }

    }
  }
  done(undefined, output + '\nLabels:\n' + JSON.stringify(labels, undefined, 4));
}

function getRegs(nRegs) {
  var regs = {};
  for (var i = 0; i < nRegs; i++) regs['R' + i] = i;
  return regs;
}
