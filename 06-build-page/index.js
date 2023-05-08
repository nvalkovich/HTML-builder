const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function createDir(dirName) {
  await fsPromises.rm(path.join(__dirname, dirName), { force: true, recursive: true });
  await fsPromises.mkdir(path.join(__dirname, dirName), { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  })
}

async function createFile(dirName, fileName) {
  await fsPromises.writeFile(path.join(__dirname, dirName, fileName), '', (err) => {
    if (err) throw err;
  })
}

async function appendFile(dirName, fileName, content) {
  fsPromises.appendFile(path.join(__dirname, dirName, fileName), content, (err) => {
    if (err) throw err;
  })
}

async function readComponent(filePath, file) {
  const data = await fsPromises.readFile(path.join(filePath, file));
  return Buffer.from(data).toString();
}

async function changeTagsToComponents() {
  const template = await fsPromises.readFile(path.join(__dirname, 'template.html'));
  let html = template.toString();

  const components = await fsPromises.readdir(path.join(__dirname, 'components'));

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const name = path.parse(component).name;
    let content = await readComponent(path.join(__dirname, 'components'), component)
    html = html.replace(`{{${name}}}`, content);
  }

  return html;
}


async function mergeFiles(pathToStylesDir) {
  const files = await fsPromises.readdir(pathToStylesDir, { withFileTypes: true });
  await createFile('project-dist', 'style.css');

  files.forEach(async (file) => {
    if (file.isDirectory() || path.extname(file.name) !== '.css') return;
    const filePath = path.join(pathToStylesDir, file.name);
    const readStream = fs.createReadStream(filePath);
    try {
      readStream.on("data", async (data) => {
        await appendFile('project-dist', 'style.css', data.toString());
      });
    } catch (err) {
      throw err;
    }
  })
}

async function createNewCopyFile(dirName, fileName) {
  const copyPath = path.join(__dirname, dirName, fileName);
  await fsPromises.writeFile(copyPath, '', err => {
    if (err) throw err;
  })
  return copyPath;
}

async function copyDir(pathToCurrentDir, pathToNewDir) {
  const files = await fsPromises.readdir(pathToCurrentDir, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isDirectory()) {
      await createDir(path.join(pathToNewDir, file.name));
      await copyDir(path.join(pathToCurrentDir, file.name), path.join(pathToNewDir, file.name));
    } else {
      const filePath = path.join(pathToCurrentDir, file.name);
      const copy = await createNewCopyFile(pathToNewDir, file.name);
      await fsPromises.copyFile(filePath, copy);
    }
  })
}

async function buildPage() {
  await createDir('project-dist');
  await createFile('project-dist', 'index.html');
  const html = await changeTagsToComponents();
  await appendFile('project-dist', 'index.html', html);
  await mergeFiles(path.join(__dirname, 'styles'));
  await copyDir(path.join(__dirname, 'assets'), path.join('project-dist', 'assets'))
}

buildPage()