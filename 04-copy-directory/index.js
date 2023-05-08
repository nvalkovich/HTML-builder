const fs = require('fs/promises');
const path = require('path');

const pathToDir = path.join(__dirname, 'files');

copyDir();

async function createDir(dirName) {
  await fs.rm(path.join(__dirname, dirName), { force: true, recursive: true });
  await fs.mkdir(path.join(__dirname, dirName), { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  })
}

async function createNewCopyFile(dirName, fileName) {
  const copyPath = path.join(__dirname, dirName, fileName);
  await fs.writeFile(copyPath, '', err => {
    if (err) throw err;
  })
  return copyPath;
}

async function copyDir() {
  await createDir('files-copy');
  const files = await fs.readdir(pathToDir);

  files.forEach(async (file) => {
    const filePath = path.join(__dirname, 'files', file);
    const copy = await createNewCopyFile('files-copy', file);
    await fs.copyFile(filePath, copy);
  })

}



