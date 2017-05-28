const http = require('http')
var express = require('express');
var bravia = require('./lib/bravia.js');
var config = require('./config.json');

var app = express();
var basicAuth = require('express-basic-auth');

const port = config.port
const tvIP = config.tvIP
const pskKey = config.psKey
const username = config.username
const password = config.password

app.use(basicAuth( { authorizer: customAuthorizer, challenge: true } ))

function customAuthorizer(providedUsername, providedPassword) {
    return username == providedUsername && password == providedPassword;
}

// Set up the server
app.get('/:intent', function (req, res) {

    // Get the intent
    var intent = req.params.intent;

    // Confirm the intent
    console.log('Running ' + intent);

    // Call the Bravia function.
    bravia(tvIP, pskKey, function (client) {

        // Call a command
        client.exec(intent);

        // Send back the ok status.
        res.sendStatus(200);

    });
});

// Set up the port listener
app.listen(port, function () {
  console.log('TV Service listening on port ' + port + '!');
  console.log('Controling TV at : ' + tvIP);
});
