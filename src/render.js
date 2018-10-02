const User = require('./kernel/classes/user.class.js');
require('./kernel/classes/window.helper');
const user = new User({
  name: 'Daniel',
  email: 'danielbonifacio@outlook.com',
  password: 'daniel123',
});
