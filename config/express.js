const bodyParser = require('body-parser');
const cors = require('cors');


const User = require('../models/user/User');
const jwt = require('jsonwebtoken');


const auth = require('../routes/auth/auth');
const admin = require('../routes/admin/admin');
const category = require('../routes/admin/category');
const advert = require('../routes/advert/advert');

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

  app.use((req, res, next) => {
    let authorization = req.headers['authorization'];

    if (!authorization) {
      return next();
    }

    let token = authorization.replace('Bearer ', '');

    jwt.verify(token, app.get('jwt_secret'), async (err, decoded) => {
      if (err) {
        let hasExpired = false;
        let isInvalid = false;
        if (err.name === 'TokenExpiredError') {
          hasExpired = true;
        } else if (err.name === 'JsonWebTokenError') {
          isInvalid = true;
        }
        
        return res.status(401).json({
          hasSuccess: false,
          hasExpired,
          isInvalid,
          message: 'You should be authenticated to continue!'
        });
      }

      let user = await User.findById(decoded.id);
      req.user = user;
      next();
    });
  });

  /*
  app.use((req, res, next) => {
    // console.log('here');

    var token = req.headers['authorization'];
    if (!token) return next();
  
    console.log(token);
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
        console.log(user);
        //req.user = user; //set the user to req so other routes can use it
        next();
      }
    });
  });
  */
  app.post('/', (req, res) => {
    res.json({
      endpoint: 'true'
    });
    console.log(req.body);
  });

  app.use('/admin', admin);
  app.use('/admin/category', category);
  app.use('/auth', auth);
  app.use('/advert', advert);
};
