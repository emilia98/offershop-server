const bodyParser = require('body-parser');
const cors = require('cors');

const admin = require('../routes/admin/admin');

module.exports = (app, config) => {
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/', (req, res) => {
    res.json({
      endpoint: 'true'
    });
    console.log(req.body);
  });

  app.use('/admin', admin);
};
