const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type:String,
    required: true
  },
  parentId: {
    type: mongoose.SchemaTypes.ObjectId,
    default: null
  },
  icon: {
    type: String,
    default: null
  }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
