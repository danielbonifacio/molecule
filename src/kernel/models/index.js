const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const dir = require('../classes/dir.helper');
const { main } = require('../paths');

/**
 * O usuário precisa de privilégios de administrador para poder alterar
 * diretórios e arquivos dentro da pasta de programas.
 * 
 * Uma alternativa à "forçar" o usuário à executar como administrador, é
 * transferir para o um path comum, o armazenamento do banco de dados.
 */
dir.createMainFolderIfNotExists();
const adapter = new FileSync(path.resolve(main, './database/db.json'));
const db = low(adapter);

module.exports = db;
