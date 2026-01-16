const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const path = require('path');
const auth = require('http-auth');

const mongoose = require('mongoose');
require('../models/Registration');         
const Registration = mongoose.model('Registration');

const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', function (req, res) {
  res.render('form', { title: 'Registration form' });
});

router.get('/registrations', basic.check((req, res) => true), function (req, res) {
  Registration.find()
    .then((registrations) => {
      res.render('index', {
        title: 'Listing registrations',
        registrations: registrations
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Database error');
    });
});

router.post(
  '/',
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),

    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  function (req, res) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);

      registration.save()
        .then(() => {
          res.send('Thank you for your registration!');
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('Database error');
        });
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

module.exports = router;
