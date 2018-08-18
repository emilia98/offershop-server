const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User'
  },
  locationId: {
    type: mongoose.SchemaTypes.ObjectId,
    default: null,
    ref: 'Location'
  },
  fisrtName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  creationDate: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now()
  },
  phone: [{
    type: String,
    default: []
  }],
  address: [{
    type: String,
    default: []
  }],
  gender: {
    type: String,
    default: null
  }
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
