 'use strict';

const express = require('express');

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Profile = mongoose.model('Profile');

const router = express.Router();

module.exports = function() {

router.post('/add', async (req, res) => {
  const user = await Profile.findOne({ username: req.body.username });
      return res.status(400).send('User not found');
  });

  return router;
}