// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


app.get('/api/:date?', function(req, res) {
  let outputDate;
  let isValidDate = true;
  
  if (req.params.date) {
    // date is filled
    if (req.params.date == parseInt(req.params.date)) {
      // date is timestamp
      outputDate = new Date(req.params.date * 1);
    } else if (new Date(req.params.date) == "Invalid Date") {
      isValidDate = false;
    } else {
      // date is date
      outputDate = new Date(req.params.date);
    }
  } else {
    outputDate = new Date();
  }

  if (isValidDate) {
    res.json({
      unix: outputDate.getTime(),
      utc: outputDate.toUTCString()
    });
  } else {
    res.json({ error : "Invalid Date" });
  }

});