const readline = require('node:readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface(process.stdin, process.stdout);
const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});

const writeLine = (text) => {
  fs.appendFile(filePath, text, (err) => {
    if (err) throw err;
  });
};

rl.question(`Hi! You can write some text here:\n`, (answer) => {
  writeLine(answer + '\n');

  rl.on('line', (input) => {
    if (input === 'exit') {
      console.log(`Ok! Good bye!`);
      rl.close();
    } else {
      writeLine(input + '\n');
    }
  });

  rl.on('SIGINT', () => {
    console.log(`Ok! Good bye!`);
    rl.close();
  });
});
