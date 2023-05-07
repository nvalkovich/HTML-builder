const fs = require('fs/promises');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');

async function readFilesInDir() {
  const files = await fs.readdir(pathToDir, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isDirectory()) return;

    const pathToFile = path.join(pathToDir, file.name);
    const stat = await fs.stat(pathToFile);
    const ext = path.extname(file.name).slice(1);;
    const name = path.parse(file.name).name;
    const size = stat.size;
    
    console.log(`${name} - ${ext} - ${size}b`);
  })
}

readFilesInDir();
