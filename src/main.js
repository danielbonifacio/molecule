const { app, BrowserWindow } = require('electron');
const { index } = require('./core/paths');

let win = null;

function createMainWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    autoHideMenuBar: true,
  });

  win.loadFile(index);

  console.log()

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