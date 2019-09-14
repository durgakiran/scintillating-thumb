'use strict'

const mongoose = require('mongoose');
const schema  = mongoose.schema

let User = new schema({
  "username": {"type": String, "required": true}
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

