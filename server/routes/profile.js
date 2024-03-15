'use strict';

const express = require('express');
var mongoose = require('mongoose');

const router = express.Router();

require('../models/Profile');

var Profile = mongoose.model('Profile');

module.exports = function() {

  router.get('/id', function(req, res, next) {
    var profileSchema = new Profile(req.body);

    if(req.body.id){
      Profile.findById(req.body.id).then(function(profile){
        if(!profile){ 
          return res.json({profile: profileSchema.toJSONFor(false)}); 
        }
        res.render('profile_template', {
          profile: profileSchema.toJSONFor(profile),
        });
      });
    } else {
      return res.json({profile: Profile.toJSONFor(false)});
    }

  });

  router.get('/*', function(req, res, next) {
    var profileSchema = new Profile(req.body);

      Profile.find().then(function(profile){
      if(!profile){ 
        return res.json({profiles: profileSchema.toJSONFor(false)}); 
      }
      else{
        res.render('profile_template', {
          profile: profileSchema.toJSONFor(profile[0]),
        });
      }
    });
  });

  return router;
}

