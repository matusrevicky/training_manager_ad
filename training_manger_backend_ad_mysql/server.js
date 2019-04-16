require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');
const config = require('config.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/trainings', require('./trainings/trainings.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
  console.log('Server listening on port ' + port);
});

////////////////////// just a test that active directory works
const ad = require('_helpers/ad');

username = config.usernameTest;
password = config.passwordTest;
ad.authenticate(username, password, function (err, auth) {
  if (err) {
    console.log("ERROR: " + JSON.stringify(err));
    return;
  }

  if (auth) {
    console.log("Authenticated !");
  } else {
    console.log("Authentication failed!");
  }
});


