'use strict'

const mongoose = require('mongoose');
const schema  = mongoose.schema

let User = new schema({
  "username": {"type": String, "required": true}
});

let userModel = user.model('User', User);