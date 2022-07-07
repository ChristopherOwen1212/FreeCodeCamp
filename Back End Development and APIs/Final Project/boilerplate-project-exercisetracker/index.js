const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const userSchema = new mongoose.Schema({ username: String });
const exerciseSchema = new mongoose.Schema({ 
  userId: String,
  description: String,
  duration: Number,
  date: Date
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

app.route('/api/users')
  .get(function(req, res) {
	  User.find({}, function (err, data) {
      if (err) {
       return done(err);
      }
      res.send(data);
    });
  })
  .post(function(req, res) {
	  User.findOne({username: req.body.username}, function (err, data) {
      if (err) {
       return done(err);
      }
  
      if (data) {
        // username is exist
        res.json({
          username: data.username,
          _id: data.id
        });
      } else {
        // new username
        let newUser = new User({ username: req.body.username });
      
        newUser.save(function(err, savedData) {
          if (err) {
           return done(err);
          }
          res.json({
            username: savedData.username,
            _id: savedData.id
          });
        });
      }
    }); 
  });

app.post('/api/users/:_id/exercises', function(req, res) {
  let userId = req.params._id;
  User.findById(userId, function (err, data) {
    if (err) {
     return done(err);
    }

    if (data) {
      // userId is exist
      let newExercise = new Exercise({ 
        userId: userId,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date ? new Date(req.body.date) : new Date()
      });

      newExercise.save(function(err, savedData) {
        if (err) {
         return done(err);
        }
        res.json({
          _id: savedData.userId,
          username: data.username,
          date: new Date(savedData.date).toDateString(),
          duration: savedData.duration,
          description: savedData.description
        });
      });
    }
  });
});

app.get('/api/users/:_id/logs', function(req, res) {
	let userId = req.params._id;
  User.findById(userId, function (err, data) {
    if (err) {
     return done(err);
    }

    if (data) {
      let { from, to, limit } = req.query;
      from = new Date(from) == 'Invalid Date' ? 0 : new Date(from);
      to = new Date(to) == 'Invalid Date' ? new Date() : new Date(to);
      limit = isNaN(parseInt(limit)) ? 0 : parseInt(limit);

      Exercise
        .find({ userId: userId })
        .where('date').gte(from).lte(to)
        .limit(limit).exec((err2, exerciseData) => {
        if (err2) {
         res.send(err2);
        } else {
          res.json({
            _id: userId,
            username: data.username,
            count: exerciseData.length,
            log: exerciseData.map(item => ({
              description: item.description,
              duration: item.duration,
              date: new Date(item.date).toDateString()
            })),
          });
        }
      });
    }
  });
});