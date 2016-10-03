const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// ------------------
// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowerase: true },
  password: String
});

// ------------------
// On Save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // keep access to user model
  const user = this;
  
  // generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    
    // hash password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      
      // overwrite plain text password with hashed password
      user.password = hash;
      next();
    });
  });
});

// ------------------
// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// ------------------
// Export the model
module.exports = ModelClass;
