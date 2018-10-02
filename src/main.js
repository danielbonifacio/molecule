const { app, BrowserWindow } = require('electron');
const path = require('path');
const setupPug = require('electron-pug');
const locals = {/* ...*/}
let win = null;

async function createMainWindow() {
  try {
    let pug = await setupPug({pretty: true}, locals)
    pug.on('error', err => console.error('electron-pug error', err))
  } catch (err) {
    // Could not initiate 'electron-pug'
  }

  win = new BrowserWindow({
    width: 1270,
    height: 690,
    minHeight: 690,
    minWidth: 1270,
    autoHideMenuBar: true,
    frame: false,
  });

  win.loadFile(path.resolve(__dirname, './app.pug'));

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createMainWindow);

// Finaliza o processo no macOS
app.on('window-all-closed', () => {
  process.platform !== 'darwin' && app.quit();
});

// ao clicar no icone na barra de aplicativos do macOS, recria a janela
app.on('activate', () => {
  win === null && createMainWindow();
});