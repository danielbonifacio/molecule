const path = require('path');
const {app} = require('electron').remote;
const resolve = solve => path.resolve(__dirname, solve);

module.exports = {
  index: resolve('../../views/index.pug'),
  main: path.resolve(app.getPath('documents'), './molecule'),
};
