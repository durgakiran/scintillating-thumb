const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
var router = express.Router();

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware


// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

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

var createAndSaveUser = require('./models.js').createAndSaveUser;
router.post('/api/exercise/new-user', (req, res, next) => {
  createAndSaveUser(req.body, function(err, data) {
    if(err) {
      console.log(err);
      return (next(err)); 
    }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
    console.log('daas' + JSON.stringify(data));
    res.json(data);
  })
  next();
});

app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



