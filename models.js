'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

let User = new schema({
  "username": {
    "type": String,
    "required": true,
    "unique": true,
    maxlength: [20, 'username too long']
  }
});

let userModel = mongoose.model('User', User);


let Exercise = new schema({
  "userId": {
    "type": String,
    "required": true
  },
  "description": {
    "type": String,
    "required": true
  },
  "duration": {
    "type": Number,
    min: 1,
    "required": true
  },
  "date": {
    "type": Date,
    default: Date.now
  }
})


// validate userId, and add "username" to the exercise instance
Exercise.pre('save', function(next) {
  mongoose.model('User').findById(this.userId, (err, user) => {
    if(err) return next(err)
    if(!user) {
      const err = new Error('unknown userId')
      err.status = 400
      return next(err)
    }
    this.username = user.username
    if(!this.date) {
      this.date = Date.now()
    }
    next();
  })
})

let exerciseModel = mongoose.model('Exercise', Exercise);


var createAndSaveUser = function (data, done) {
  console.log(data);
  let user = new userModel(data);
  console.log(user);
  //done(null, user);
  user.save((err, data) => {
    if (err) done(err, null);
    console.log('save success!');
    done(null, data);
  });
}


//add exercise
var createExercise = function (data, done) {
  console.log(data);
  let exercise = new exerciseModel(data);
  console.log(exercise);
  //done(null, user);
  exercise.save((err, data) => {
    if (err) done(err, null);
    console.log('save success!');
    userModel.find({"_id": data.userId}, (err, user) => {
      console.log(user);
      if(err) done(err, user);
      exerciseModel.find({"userId": data.userId}, (err, exercises) => {
        let tmpData = {};
        console.log(exercises);
        tmpData.user = user[0];
        tmpData.exercises = exercises;
        console.log(tmpData);
        done(null, [tmpData]);
      })
    })
  });
}


var getAllUsers = function (done) {
  userModel.find({}, (err, data) => {
    console.log(data);
    if (err) done(err, null);
    done(null, data);
  })
}

var getExercisesByUserId = function (userId, done) {
  userModel.find({"_id": userId}, (err, user) => {
    console.log(user);
    if(err) done(err, null);
    exerciseModel.find({"userId": userId}, (err, exercises) => {
      let tmpData = {};
      console.log(exercises);
      tmpData.user = user[0];
      tmpData.exercises = exercises;
      console.log(tmpData);
      done(null, [tmpData]);
    })
  })
}

var getExercisesByUserIdFromTo = function (userId,fromDate, toDate, done) {
  userModel.find({"_id": userId}, (err, user) => {
    console.log(user);
    if(err) done(err, null);
    exerciseModel.find({"userId": userId, "date": { $gt: new Date(fromDate), $lt: new Date(toDate)}}, (err, exercises) => {
      let tmpData = {};
      console.log(exercises);
      tmpData.user = user[0];
      tmpData.exercises = exercises;
      console.log(tmpData);
      done(null, [tmpData]);
    })
  })
}



/* all exports*/

exports.userModel = userModel;
exports.createAndSaveUser = createAndSaveUser;
exports.createExercise = createExercise;
exports.getAllUsers = getAllUsers;
exports.getExercisesByUserId = getExercisesByUserId;
exports.getExercisesByUserIdFromTo = getExercisesByUserIdFromTo;