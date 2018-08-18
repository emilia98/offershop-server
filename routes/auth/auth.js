const router = require('express').Router();
const User = require('../../models/user/User');
const Profile = require('../../models/user/Profile');
const encryption = require('../../utilities/encryption');
const jwt = require('jsonwebtoken');

const secret = 'my-offer-shop';

router.post('/register', async (req, res) => {
  let { username, email, password, confirmPass } = req.body;
  let hasErrors = false;
  let hasMissingFields = false;

  let usernameErrors = {};
  let emailErrors = {};
  let passwordErrors = {};
  let confirmPassErrors = {};

  let missingFields = {
    username: false,
    email: false,
    password: false,
    confirmPass: false
  };

  if (typeof (username) !== 'string') {
    hasMissingFields = true;
    missingFields.username = true;
  }

  if (typeof (email) !== 'string') {
    hasMissingFields = true;
    missingFields.email = true;
  }

  if (typeof (password) !== 'string') {
    hasMissingFields = true;
    missingFields.password = true;
  }

  if (typeof (confirmPass) !== 'string') {
    hasMissingFields = true;
    missingFields.confirmPass = true;
  }

  if (hasMissingFields) {
    return res.status(422).json({
      missingFields
    });
  }

  if (username.length === 0) {
    hasErrors = true;
    usernameErrors.required = true;
  }

  if (email.length === 0) {
    hasErrors = true;
    emailErrors.required = true;
  }

  if (password.length === 0) {
    hasErrors = true;
    passwordErrors.required = true;
  }

  if (confirmPass.length === 0) {
    hasErrors = true;
    confirmPassErrors.required = true;
  }

  if (/^\w+$/g.test(username) === false) {
    hasErrors = true;
    usernameErrors.containsForbiddenChars = true;
  }

  if (username.length < 3 || username.length > 20) {
    hasErrors = true;
    usernameErrors.hasUnproperLength = true;
  }

  let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let passwordPattern = /^[A-Za-z0-9_\@\#\$\&\-\*]+$/g;

  if (emailPattern.test(email) === false) {
    hasErrors = true;
    emailErrors.hasIncorrectFormat = true;
  }

  if (passwordPattern.test(password) === false) {
    hasErrors = true;
    passwordErrors.containsForbiddenChars = true;
  }

  if (password.length < 4 || password.length > 20) {
    hasErrors = true;
    passwordErrors.hasUnproperLength = true;
  }

  if (confirmPass !== password) {
    hasErrors = true;
    confirmPassErrors.doesNotMatch = true;
  }

  if (hasErrors) {
    let errors = {
      username: usernameErrors,
      email: emailErrors,
      password: passwordErrors,
      confirmPass: confirmPassErrors
    };

    return res.status(422).json({
      hasErrors: true,
      errors
    });
  }

  let userByUsername;
  let userByEmail;

  try {
    userByUsername = await User.findOne({username: username});
    userByEmail = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      hasServerError: true,
      error: 'Something went wrong while registring a new user!'
    });
  }

  if (userByUsername) {
    return res.status(409).json({
      hasRejected: true,
      errorMsg: 'This username is already taken!'
    });
  }

  if (userByEmail) {
    return res.status(409).json({
      hasRejected: true,
      errorMsg: 'This email has already been used by a user!'
    });
  }

  let salt = encryption.generateSalt();
  let hashedPassword = encryption.generateHashedPassword(salt, password);

  let user;
  let profile;

  try {
    user = await User.create({
      username: username,
      email: email,
      salt: salt,
      hashedPassword: hashedPassword
    });

    profile = await Profile.create({
      userId: user._id,
      creationDate: Date.now()
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Something went wrong while registring a new user!'
    });
  }

  res.status(200).json({
    hasSuccess: true
  });
});

router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let user = await User.findOne({ username: username });
  
  if (!user) {
    return res.status(401).json({
      hasError: true,
      errorMsg: 'This user does not exist!'
    });
  }

  let correctPass = encryption.generateHashedPassword(user.salt, password) === user.hashedPassword;

  if (!correctPass) {
    return res.status(401).json({
      hasError: true,
      errorMsg: 'Invalid password!'
    });
  }

  const payload = {
    id: user._id
  };

  let token = jwt.sign(payload, secret, {
    expiresIn: 60 * 60 * 4
  });

  return res.status(200).json({
    hasSuccess: true,
    token,
    username: user.username
  });
});
module.exports = router;
