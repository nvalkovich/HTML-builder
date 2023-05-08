const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const pathToStylesDir = path.join(__dirname, 'styles');

async function createFile(dirName, fileName) {
  fsPromises.writeFile(path.join(__dirname, dirName, fileName), '', (err) => {
    if (err) throw err;
  })
}

async function appendFile(dirName, fileName, content) {
  fsPromises.appendFile(path.join(__dirname, dirName, fileName), content, (err) => {
    if (err) throw err;
  })
}

async function mergeFiles() {
  const files = await fsPromises.readdir(pathToStylesDir, { withFileTypes: true });
  await createFile('project-dist', 'bundle.css');

  files.forEach(async (file) => {
    if (file.isDirectory() || path.extname(file.name) !== '.css') return;
    const filePath = path.join(pathToStylesDir, file.name);
    const readStream = fs.createReadStream(filePath);
    try {
      readStream.on("data", async (data) => {
        await appendFile('project-dist', 'bundle.css', data.toString());
      });
    } catch (err) {
      throw err;
    }
  })
}

mergeFiles();