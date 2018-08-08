const express = require('express');

// CONFIGURATIONS:
const config = require('./config/config');
const db = require('./config/database');
const appConfig = require('./config/express');

const port = 8080;
const app = express();
const environment = process.env.NODE_ENV || 'development';

db(config[environment]);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
appConfig(app, config);
