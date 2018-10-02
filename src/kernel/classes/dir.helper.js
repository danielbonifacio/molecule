const path = require('path');
const { app, dialog } = require('electron').remote;
const fs = require('fs');

const mainPath = path.resolve(app.getPath('documents'), './molecule');
const dbPath = path.resolve(app.getPath('documents'), './molecule/database');

class Dir {
  static verifyMainFolder() {
    return fs.existsSync(mainPath); 
  }
  static verifyDbFolder() {
    return fs.existsSync(dbPath); 
  }

  static createMainFolderIfNotExists() {
    try {
      !this.verifyMainFolder() && fs.mkdirSync(mainPath);
      !this.verifyDbFolder() && fs.mkdirSync(dbPath);
      return true;
    } catch(e) {
      dialog.showErrorBox('Erro ao criar diretórios principais!', e.message);
      return false;
    }
  }
 
}

module.exports = Dir;