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




var createAndSaveUser = require('./models.js').createAndSaveUser;

router.post('/api/exercise/new-user', (req, res, next) => {
  console.log(req.body);
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
  next();
});




// Error Handling middleware







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



