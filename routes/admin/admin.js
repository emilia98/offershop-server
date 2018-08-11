const express = require('express');
const router = express.Router();

// TODO: Some middlewares here - for auth & admin
router.post('/category/new', (req, res) => {
  // console.log(req.body);
  res.json(req.body);
});

router.post('/location/new', (req, res) => {
  // console.log('here');
  let data = req.body;
  let hasErrors = false;
  let hasMissingFields = false;

  let errors = {
    name: {},
    type: [],
    postCode: {},
    latitude: [],
    longitude: []
  };
  let missingFields = {
    name: false,
    type: false,
    postCode: false,
    latitude: false,
    longitude: false
  };

  //console.log(data.name);
  console.log(req.body);
  
  if (data.name !== undefined) {
    if (data.name.length < 1 || data.name.length > 100) {
      errors.name['invalidLength'] = true;
      hasErrors = true;
    }

    let pattern = /^([А-Я][а-яА-Я ]*)$/g;

    if (pattern.test(data.name) === false) {
      errors.name['invalidFormat'] = true;
      hasErrors = true;
    }
  } else {
    hasMissingFields = true;
    missingFields.name = true;
  }

  if (data.postCode !== undefined) {
    let pattern = /^\d{4}$/g;

    if (pattern.test(data.postCode)) {
      let toNumber = parseInt(data.postCode);

      if (toNumber < 1000 || toNumber > 9999) {
        errors.postCode['invalidCode'] = true;
        hasErrors = true;
      }
    } else {
      errors.postCode['invalidCode'] = true;
      hasErrors = true;
    }
  } else {
    hasMissingFields = true;
    missingFields.postCode = true;
  }

  if (hasMissingFields) {
    return res.status(400).json({
      hasMissingFields: true,
      missingFields
    });
  }

  if (hasErrors) {
    return res.status(400).json({
      hasErrors: true,
      errors
    });
  }
  
  res.status(200).json({
    'What': 'TF'
  })
});

module.exports = router;
