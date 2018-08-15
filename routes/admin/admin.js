const express = require('express');
const router = express.Router();

const validateLocation = require('../../helpers/location').validateLocation;
const Location = require('../../models/admin/Location');

// TODO: Some middlewares here - for auth & admin
router.post('/category/new', (req, res) => {
  // console.log(req.body);
  res.json(req.body);
});

router.post('/location/new', async (req, res) => {
  // console.log('here');
  let data = req.body;
  let {
    hasErrors,
    errors,
    hasMissingFields,
    missingFields
  } = validateLocation(data);

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

router.get('/location/list', async (req, res) => {
  let locations;

  try {
    locations = await Location.find();
  } catch (err) {
    res.status(500).json({
      error: 'Something went wrong! Connect us to solve the problem!'
    });
  }

  console.log(locations);
  res.status(200).json({
    locations
  });
});

router.get('/location/details/:id', async (req, res) => {
  let id = req.params.id;

  let location;

  try {
    location = await Location.findById(id);
  } catch (err) {
    return res.status(404).json({
      hasError: true,
      message: 'This location does not exist!'
    });
  }

  res.status(200).json({
    hasSuccess: true,
    location
  });
});

router.post('/location/edit/:id', async (req, res) => {
  let id = req.params.id;
  let location;
  let data = req.body;

  try {
    location = await Location.findById(id);
  } catch (err) {
    return res.status(404).json({
      hasError: true,
      message: 'This location does not exist!'
    });
  }

  let {
    hasErrors,
    errors,
    hasMissingFields,
    missingFields
  } = validateLocation(data);

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

  location.name = data.name;
  location.postCode = data.postCode;
  location.locationType = data.type;
  location.latitude = data.latitude;
  location.longitude = data.longitude;
  
  location = await location.save();

  res.status(200).json({
    hasSuccess: true,
    location
  });
});

module.exports = router;
