const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  name_to_lower: {
    type: String,
    require: true
  },
  locationType: {
    type: String,
    require: true
  },
  postCode: {
    type: Number,
    require: true
  },
  latitude: {
    type: Number,
    require: true
  },
  longitude: {
    type: Number,
    require: true
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    default: null
  },
  creationDate: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now()
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Location', locationSchema);
