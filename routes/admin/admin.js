const express = require('express');
const router = express.Router();

const Location = require('../../models/admin/Location');

// TODO: Some middlewares here - for auth & admin
router.post('/category/new', (req, res) => {
  // console.log(req.body);
  res.json(req.body);
});

router.post('/location/new', async (req, res) => {
  // console.log('here');
  let data = req.body;
  let hasErrors = false;
  let hasMissingFields = false;

  let errors = {
    name: {},
    type: {},
    postCode: {},
    latitude: {},
    longitude: {}
  };
  let missingFields = {
    name: false,
    type: false,
    postCode: false,
    latitude: false,
    longitude: false
  };

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

  if (data.latitude !== undefined) {
    let pattern = /^(-?)(\d*?)(\.?)(\d+)$/g;

    if (pattern.test(data.latitude)) {
      let toNumber = parseFloat(data.latitude);

      if (toNumber < -90 || toNumber > 90) {
        errors.latitude['invalidLatitude'] = true;
        hasErrors = true;
      }
    } else {
      errors.latitude['invalidLatitude'] = true;
      hasErrors = true;
    }
  } else {
    hasMissingFields = true;
    missingFields.latitude = true;
  }

  if (data.longitude !== undefined) {
    let pattern = /^(-?)(\d*?)(\.?)(\d+)$/g;

    if (pattern.test(data.longitude)) {
      let toNumber = parseFloat(data.longitude);

      if (toNumber < -180 || toNumber > 180) {
        errors.longitude['invalidLongitude'] = true;
        hasErrors = true;
      }
    } else {
      errors.longitude['invalidLongitude'] = true;
      hasErrors = true;
    }
  } else {
    hasMissingFields = true;
    missingFields.longitude = true;
  }

  if (data.type !== undefined) {
    if (data.type !== 'град' && data.type !== 'село') {
      errors.type['invalidType'] = true;
      hasErrors = true;
    }
  } else {
    hasMissingFields = true;
    missingFields.type = true;
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

  let location;

  try {
    location = await Location.create({
      name: data.name,
      locationType: data.type,
      postCode: data.postCode,
      latitude: data.latitude,
      longitude: data.longitude
    });

    console.log(location);
  } catch (err) {
    throw new Error(err);
  }

 
  res.status(200).json({
    'success': 'true'
  });
});

module.exports = router;
