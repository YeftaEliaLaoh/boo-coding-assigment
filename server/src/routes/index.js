'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const JWT_SECRET = 'your_secret_key';

require('../models/Profile');
require('../models/Comment');

var Profile = mongoose.model('Profile');
var Comment = mongoose.model('Comment');

module.exports = function() {

router.post('/register', [
  body('username').notEmpty().isLength({ min: 5 }),
  body('password').notEmpty().isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new Profile({
          username: req.body.username,
          password: hashedPassword
      });
      await user.save();
      res.status(201).send('User registered successfully');
  } catch (err) {
      res.status(500).send('Error registering user');
  }
});   
  
router.post('/login', async (req, res) => {
  const user = await Profile.findOne({ username: req.body.username });
  if (!user) {
      return res.status(400).send('User not found');
  }

  try {
      if (await bcrypt.compare(req.body.password, user.password)) {
          const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);
          res.json({ accessToken: accessToken });
      } else {
          res.status(401).send('Incorrect password');
      }
  } catch(err) {
    console.log(err);
    res.status(500).send('Error logging in');
  }
});

router.post('/update', async (req, res) => {
  try {
    const { name,
      description,
      mbti,
      enneagram,
      variant,
      tritype,
      socionics,
      sloan,
      psyche,
      image } = req.body;
 
    const filter = { username: req.body.username };
    
    if(req.body.username){
      const updatedUser = await Profile.findOneAndUpdate(filter, {  name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche, image },
         { new: true });
      if(updatedUser){
        res.status(200).send('User update successfully');
      }
      else {
        res.status(401).send('Incorrect');
      }
    }

  } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
  }
});

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

router.get('/', function(req, res, next) {
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

router.post('/add', async (req, res) => {
    Profile.findOne({ username: req.body.profile }).then(function(user){
      if(!user){ return res.sendStatus(401); }

      var comment = new Comment(req.body);
      comment.body = req.body.comment;
      comment.author = req.body.username;
      comment.profile = user;

      return comment.save().then(function(){
          res.json({comment: comment.toJSONFor(user)});
      });
    })
  
});


router.get('/comments', function(req, res, next){
    Promise.resolve(req.body ? Profile.findOne({ username: req.body.username }) : null).then(async function(user){
      var sort = 1;
      const str2 = 'hello';

      if (req.body.sort.toLowerCase() === 'desc') {
         sort = -1;
      } 
      console.log('Sort '+sort);

      Comment.find({ body: { $regex: req.body.comment, $options: 'i' } })
      .populate('author') // Populate the 'profile' field
      .sort({ createdAt: sort }) // Sort by createdAt in descending order
      .exec().then(function(article) {
        return res.json({comments: article.map(function(comment){
          return comment.toJSONFor(user);
        })});
     // console.log(comments);

   // return comments;
    });
  });
});

router.post('/favorite', function(req, res, next) {
  var commentId = req.body.comment.id;

  // User.findById(req.payload.id).then(function(user){
  //   if (!user) { return res.sendStatus(401); }

    Comment.findById(commentId).then(function(comment){
      if(comment){ 
        comment.favorites += 1;
        return comment.save().then(function(){
          res.json({comment: comment.toJSONFor(false)});
      });
      }
      else{
        return res.json({comment: comment.toJSONFor(false)});
      }
    }).catch(next);
  });
//});

router.post('/unfavorite', function(req, res, next) {
  var commentId = req.body.comment.id;

    Comment.findById(commentId).then(function(comment){
      if(comment){ 
        comment.favorites -= 1;
        return comment.save().then(function(){
          res.json({comment: comment.toJSONFor(false)});
      });
      }
      else{
        return res.json({comment: comment.toJSONFor(false)});
      }
    }).catch(next);
  });

return router;
}