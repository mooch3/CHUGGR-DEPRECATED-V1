const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('landingpage')
});

router.get('/createaccount', (req, res) => {
  res.render('createaccount')
});

router.get('/signin', (req, res) => {
  res.render('signin')
});

module.exports = router;
