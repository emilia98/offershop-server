const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');

const Location = require('../../models/admin/Location');

/* Won;t update when the date changes
let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
console.log(today);
let uploadsFolder = `./${day}-${month}-${year}/`;
*/ 

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) {
        throw new Error('Error!');
      }
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
let upload = multer({ storage: storage });

router.post('/new', upload.array('images', 6), async (req, res) => {
  let files = req.files;
  let data = req.body.data;

  console.log(files);
  console.log(JSON.parse(data));
});

router.post('/locations', async (req, res) => {
  let locations;
  let name = req.body.name;
  let params = {};

  if (name && name.length > 0) {
    params['name_to_lower'] = { $regex: new RegExp("^" + name.toLowerCase(), "i") }
  }

  try {
    locations = await Location.find(params);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      hasServerError: true,
      errorMsg: 'An error occurred while getting locations.'
    });
  }

  let filteredData = [];

  for (let location of locations) {
    if (location.isActive) {
      filteredData.push({
        id: location._id,
        name: location.name,
        postCode: location.postCode
      });
    }
  }

  res.status(200).json({
    hasSuccess: true,
    locations: filteredData
  });
});

module.exports = router;
