const bodyParser = require('body-parser');
const cors = require('cors');


const User = require('../models/user/User');
const jwt = require('jsonwebtoken');


const auth = require('../routes/auth/auth');
const admin = require('../routes/admin/admin');

module.exports = (app, config) => {
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.set('jwt_secret', 'my-offer-shop');


  /* app.use((req, res, next) => {
    let token = req.body.token || req.headers['x-access-token'];

    console.log(token);
    next();
  }); */

  app.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue
  
    token = token.replace('Bearer ', '');
  
    jwt.verify(token, app.get('jwt_secret'), async function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(401).json({
          success: false,
          message: 'Please register Log in using a valid email to submit posts'
        });
      } else {
        // console.log(decoded);
        // eq

        let user = await User.findById(decoded.id);
        req.user = user;
        //req.user = user; //set the user to req so other routes can use it
        next();
      }
    });
  });
  app.post('/', (req, res) => {
    res.json({
      endpoint: 'true'
    });
    console.log(req.body);
  });

  app.use('/admin', admin);
  app.use('/auth', auth);
};
