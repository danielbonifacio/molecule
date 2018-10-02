const userModel = require('../models/user.model');

class User {
  constructor(user) {
    userModel.initialize();
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }

  save() {
    userModel.save(this);
  }
}

module.exports = User;
