'use strict'

const mongoose = require('mongoose');
const schema  = mongoose.Schema;

let User = new schema({
  "username": {"type": String, "required": true, "unique": true, maxlength: [20, 'username too long']}
});

let userModel = mongoose.model('User', User);


var createAndSaveUser = function(data, done){
  console.log(data);
  let user = new userModel(data);
  console.log(user);
  user.save(function (err, data) {
    console.log('save success!');
    done(null , data);
  });
}

/* all exports*/

exports.userModel = userModel ;
exports.createAndSaveUser = createAndSaveUser;

