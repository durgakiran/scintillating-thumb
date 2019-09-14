'use strict'

const mongoose = require('mongoose');
const schema  = mongoose.Schema;

let User = new schema({
  "username": {"type": String, "required": true, "unique": true, maxlength: [20, 'username too long']}
});

let userModel = mongoose.model('User', User);


var createAndSaveUser = function(data, done){
  let user = new User(data);
  user.save(function (err, data) {
    done(null , data);
  });
}

/* all exports*/

exports.userModel = userModel ;
exports.createAndSaveUser = createAndSaveUser;

