const express = require('express');
const router = express.Router();

// TODO: Some middlewares here - for auth & admin
router.post('/category/new', (req, res) => {
  // console.log(req.body);
  res.json(req.body);
});

module.exports = router;
