const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const Tray = electron.Tray
const {ipcMain} = require('electron')

const fs = require('fs')
var dirDoc = app.getPath('documents') + '\\Molecule'
var sttDir = app.getPath('documents') + '\\Molecule\\conf'
var defaultSettings = '{"tabLivePush":true,"console":false,"livePush":true}'

if (!fs.existsSync(dirDoc)){
    fs.mkdirSync(dirDoc)
    fs.mkdirSync(sttDir)
    fs.writeFile(sttDir + '\\settings.json', defaultSettings)
}

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

let mainWindow
let loginWindow

function loginApp () {
  const loginIcon = new Tray(__dirname + '/idt/tray_icon.png')

  //Definindo as janelas
  loginWindow = new BrowserWindow({
    width: 640,
    height: 480,
    frame: true,
    icon: __dirname + '/idt/icon.png',
    transparent: false,
    minWidth: 640,
    minHeight: 480,
    autoHideMenuBar: true
  })

  //Carregando a página de login
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'login.html'),
    protocol: 'file:',
    slashes: true
  }))
}

function createWindow () {

  const appIcon = new Tray(__dirname+'/idt/tray_icon.png')
  //Definindo as janelas
  mainWindow = new BrowserWindow({width: 1024, height: 768, frame: false, icon:__dirname+'/idt/icon.png', transparent: false, minWidth: 1000, minHeight: 710, show: false})

  // carregando o index.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //mainWindow.webContents.openDevTools

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function loadingPage () {
  const appIcon = new Tray(__dirname+'/idt/tray_icon.png')
  loadingWindow = new BrowserWindow({width: 500, height: 376, frame: false, icon:__dirname+'/idt/icon.png', transparent: false, show: false})
  loadingWindow.setResizable(false)
  // carregando o index.
  loadingWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loading.html'),
    protocol: 'file:',
    slashes: true
  }))

  loadingWindow.once('ready-to-show', () => {
    loadingWindow.show()
  })

  loadingWindow.on('closed', function () {
    loadingWindow = null
  })
}


ipcMain.on('request-doc', (event, arg) => {
  event.returnValue = app.getPath('documents')
})

app.on('ready', function () {
  loadingPage()
  createWindow()
  setTimeout(function(){ 
      loadingWindow.close();
      mainWindow.show();
  }, 3000);
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function developerMode() {
  var txt;
  var r = confirm("Você realmente deseja entrar no modo desenvoldedor?");
  if (r == true) {
      mainWindow.webContents.openDevTools
      alert('Você está no modo desenvoldedor. Qualquer ação realizada aqui pode danificar seu computador.')
  } else {
      console.log('Modo de desenvoldedor abortado.')
  }
}


function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated

          application.quit();
          return true;
  }
};