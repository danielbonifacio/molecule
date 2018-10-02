const db = require('./');
const USERS = 'users';

class UserModel {
  static initialize() {
    db.defaults({ users: [] })
      .write();
  }

  static save(newUser) {
    db.get(USERS)
      .push(newUser)
      .write();
  }
}

module.exports = UserModel;
