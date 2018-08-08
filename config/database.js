const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (config) => {
  mongoose.connect(config.connectionString, { useNewUrlParser: true });
  let database = mongoose.connect;

  if (database.readyState === 0) {
    throw new Error('Error connecting to database!');
  }

  console.log('Connected to database...');
};
