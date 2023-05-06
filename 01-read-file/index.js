const fs = require('fs');
const path = require('path');

const filePath = path.join('01-read-file', 'text.txt');
const readStream = fs.createReadStream(filePath);

try {
  readStream.on("data", (data) => {
    console.log(data.toString());
  })
} catch (err) {
  console.log('err:', err);
}
