const mongoose = require('mongoose');
const encryption = require('../../utilities/encryption');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  profileId: {
    type: mongoose.SchemaTypes.ObjectId,
    default: null
  },
  roles: [{
    type: String,
    default: ['User']
  }]
});

const User = mongoose.model('User', userSchema);

userSchema.method({
  checkPassword: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.hashedPassword;
  }
});

module.exports = User;

module.exports.generateAdmin = () => {
  async function administrate () {
    let users = await User.find();

    if (users.length > 0) {
      return;
    }

    let salt = encryption.generateSalt();
    let hashedPassword = encryption.generateHashedPassword(salt, 'admin');

    let admin = await User.create({
      username: 'admin',
      salt: salt,
      hashedPass: hashedPassword,
      email: null,
      roles: [ 'Admin', 'User' ],
      profileId: null
    });

    console.log(admin);
  }

  administrate();
};
