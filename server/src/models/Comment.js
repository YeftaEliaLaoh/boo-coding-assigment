var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  favorites: {type: Number, default: 0},
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    id : this._id,
    profile: user.username,
    author: this.author,
    body: this.body,
    favorites: this.favorites,
    createdAt: this.createdAt,
  };
};

mongoose.model('Comment', CommentSchema);
