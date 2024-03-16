var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  name: String,
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  image: String,
}, {timestamps: true});

ProfileSchema.methods.test = function(){
  return this.save().then(function(){
    return res.json({this: this.toJSONFor()});
  });
}

ProfileSchema.methods.toJSONFor = function(profile){
  return {
    id: profile._id,
    username: profile.username,
    name: profile.name,
    description: profile.description,
    mbti: profile.mbti,
    enneagram: profile.enneagram,
    variant: profile.variant,
    tritype: profile.tritype,
    socionics: profile.socionics,
    sloan: profile.sloan,
    psyche: profile.psyche,
    image: profile.image,
  };
};

mongoose.model('Profile', ProfileSchema);
