// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//US1: The API endpoint is GET [project_url]/api/timestamp/:date_string?
app.route('/api/timestamp/:timestamp?')
  .get(function (req, res){
    
    //US2: A date string is valid if can be successfully parsed by 
    //new Date(date_string) (JS) . Note that the unix timestamp needs 
    //to be an integer (not a string) specifying milliseconds. In our test 
    //we will use date strings compliant with ISO-8601 (e.g. "2016-11-20") 
    //because this will ensure an UTC timestamp.
  
    var date = null;
    // parse the date string
    if (req.params.timestamp !== undefined) {

      // check if it is a unix timestamp...
      var unixTimestamp = parseInt(req.params.timestamp*1);
      if (isNaN(unixTimestamp)) {
        
        // it's not a unix timestamp string
        date = new Date(req.params.timestamp);
      } else {
        
        // it is a timestamp
        date = new Date(unixTimestamp);
      }
      
    } else {
      
      //US3: If the date string is empty it should be equivalent to trigger 
      //new Date(), i.e. the service uses the current timestamp.
      // the date string parameter is empty. 
      // create a new date based on current time 
      date = new Date(Date.now());
    }
    //US4: If the date string is valid the api returns a JSON having the structure 
    //{"unix": <date.getTime()>, "utc" : <date.toUTCString()> } e.g. 
    //{"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}.
    //US5: If the date string is invalid the api returns a JSON having the 
    //structure {"unix": null, "utc" : "Invalid Date" }. It is what you get 
    //from the date manipulation functions used above.
    // Initialize the response object, if Date is invalid
    // this one will be returned

    var response = date == "Invalid Date" ? 
      { error: "Invalid Date" } :
      { "unix": date.getTime(),
        "utc": date.toUTCString()
      };
    
    res.json(response);
  });


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});