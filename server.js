const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
var router = express.Router();

const mongoose = require('mongoose')
mongoose.connect("mongodb://durgakiran:vijay17791@ds157187.mlab.com:57187/exercise-tracker" || 'mongodb://localhost/exercise-track', { useMongoClient: true/* other options */ } )
mongoose.connection.on('connected', function () {
	console.log('Mongoose default connection open to ');
});


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/exercise', router)


var createAndSaveUser = require('./models.js').createAndSaveUser;
router.post('/new-user', (req, res, next) => {
  createAndSaveUser(req.body, function(err, data) {
    if(err) {
      //console.log("error happened" + err);
      return (next(err)); 
    }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
    //console.log('daas' + JSON.stringify(data));
    res.json(data);
  })
  //next();
});

var createExercise = require('./models.js').createExercise;
router.post('/add', (req, res, next) => {
  createExercise(req.body, function(err, data) {
    if(err) {
      //console.log("error happened" + err);
      return (next(err)); 
    }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
    //console.log('daas' + JSON.stringify(data));
    res.json(data);
  })
});

var getAllUsers = require('./models.js').getAllUsers;
router.get('/users', (req, res, next) => {
  getAllUsers((err, data) => {
    if(err) res.send("something bad happened");
    else res.json(data);
  })
})

var getExercisesByUserId = require('./models.js').getExercisesByUserId;
var getExercisesByUserIdFromTo = require('./models.js').getExercisesByUserIdFromTo;
router.get('/log', (req, res, next) => {
  let userId = req.query.userId;
  let fromDate = null;
  let toDate = null;
  if(req.query.from && req.query.to) {
    fromDate = req.query.from;
    toDate = req.query.to;
  }
  console.log(fromDate)
  if (fromDate) {
    getExercisesByUserIdFromTo(userId,fromDate, toDate,  (err, data) => {
      if(err) next(err);
      else res.json(data);
    })
  }else {
    getExercisesByUserId(userId, (err, data) => {
      if(err) next(err);
      else res.json(data);
    })
  }
})



// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage
  console.log(err);
  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
});






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



