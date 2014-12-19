var Config = require('../config.js');

var optable = [
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  'LD', 'ST', null, 'JMP', 'BEQ', 'BNE', null, 'LDR',
  'ADD', 'SUB', 'MUL', 'DIV', 'CMPEQ', 'CMPLT', 'CMPLE', null,
  'AND', 'OR', 'XOR', 'XNOR', 'SHL', 'SHR', 'SRA', null,
  'ADDC', 'SUBC', 'MULC', 'DIVC', 'CMPEQC', 'CMPLTC', 'CMPLEC', null,
  'ANDC', 'ORC', 'XORC', 'XNORC', 'SHLC', 'SHRC', 'SRAC', null
];

module.exports = {
  assemble: assemble
};

function assemble(assembly, done) {

  // Regex
  var label = /^([a-zA-Z0-9_]+):$/;
  var OP = /^([a-zA-Z0-9_]+)\(([a-zA-Z0-9_,]*)\)$/

  var output = '';
  var nBytes = 4;
  if (assembly) {

    var labels = getRegs(32);

    // Remove whitespace
    assembly = assembly.replace(/[^\S\n]+/g, '');

    // Remove comments
    assembly = assembly.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');

    // Split into lines
    var lines = assembly.match(/[^\r\n]+/g);

    var instructions = [];

    // Register labels and instructions
    for (var i = 0, l = 0; i < lines.length; i++) {

      var line = lines[i];

      // Process line
      if (label.test(line)) {

        // Tokenize
        var tokens = label.exec(line);

        // Extract tokens
        var name = tokens[1];

        output += name + ' <- ' + l + '\n';

        if (labels[name] !== undefined) output += 'ERROR: Label already exists.\n';
        else labels[name] = l;

      } else if (OP.test(line)) {

        instructions.push(OP.exec(line));
        l++;

      }

    }

    // Resolve labels
    for (var i = 0; i < instructions.length; i++) {

      // Extract tokens
      var OP = instructions[i][1];
      var args = instructions[i][2];

      var instruction = 0;

      if (OP === 'LONG') instruction = parseInt(args);
      else {
        var opcode = optable.indexOf(OP);
        if (opcode != -1) {
          instruction = opcode << (32 - 6);
          args = args.split(',');
          var opclass = opcode >>> (6 - 2);
          if (opclass == 1) {
            if (OP === 'ST') {
              instruction += labels[args[0]] << (26 - 5);
              instruction += labels[args[2]] << (21 - 5);
              instruction += labels[args[1]] || parseInt(args[1]);
            } else if (OP === 'JMP') {
              instruction += labels[args[1]] << (26 - 5);
              instruction += labels[args[0]] << (21 - 5);
            } else if (OP === 'LDR') {
              instruction += labels[args[1]] << (26 - 5);
              instruction += labels[args[1]] || parseInt(args[0]);
            } else {
              instruction += labels[args[2]] << (26 - 5);
              instruction += labels[args[0]] << (21 - 5);
              instruction += labels[args[1]] || parseInt(args[1]);
            }
          } else if (opclass == 2) {
            instruction += labels[args[2]] << (26 - 5);
            instruction += labels[args[0]] << (21 - 5);
            instruction += labels[args[1]] << (16 - 5);
          } else if (opclass == 3) {
            instruction += labels[args[2]] << (26 - 5);
            instruction += labels[args[0]] << (21 - 5);
            instruction += labels[args[1]] || parseInt(args[1]);
          }
        } else output += 'ERROR\n';
      }

      output += hex(instruction) + ' ';

    }

  }
  done(undefined, output);

}

function getRegs(nRegs) {
  var regs = {};
  for (var i = 0; i < nRegs; i++) regs['R' + i] = i;
  return regs;
}

function hex(d) {
  return ('00000000' + (d < 0 ? (0xFFFFFFFF + d + 1) : d).toString(16)).substr(-8);
}
