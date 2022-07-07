require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const shortId = require('shortid');
const validUrl = require('valid-url');

app.use(bodyParser.urlencoded({extended: false}));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const mongoose = require('mongoose');
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});

let URL = mongoose.model('URL', urlSchema);

app.get('/api/shorturl/:short_url?', function(req, res) {
	URL.findOne({short_url: req.params.short_url}, function (err, data) {
      if (err) {
       return done(err);
      }
  
      if (data) {
        res.redirect(data.original_url);
      } else {
        res.json({ error: 'invalid url' });
      }
  });
});

app.post('/api/shorturl', function(req, res) {
  URL.findOne({original_url: req.body.url}, function (err, data) {
    if (err) {
     return done(err);
    }

    if (data) {
      // original_url is exist
      res.json({
        original_url: data.original_url,
        short_url: data.short_url
      });
    } else {
      // new original_url
      if (validUrl.isWebUri(req.body.url)) {
        let shortUrl = shortId.generate();
        let newData = new URL({
          original_url: req.body.url,
          short_url: shortUrl
        });
      
        newData.save(function(err, savedData) {
          if (err) {
           return done(err);
          }
          res.json({
            original_url: savedData.original_url,
            short_url: savedData.short_url
          });
        });
      } else {
        res.json({ error: 'invalid url' });
      }
    }
  });  
});