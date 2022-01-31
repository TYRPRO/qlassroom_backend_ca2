//Qlassroom Forums

//-----------------------------------
// imports
//-----------------------------------

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//-----------------------------------
// Middleware functions
//-----------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const printDebugInfo = require('./middleware/printDebugInfo');
var jsonParser = bodyParser.json();
var cors = require('cors');
const subforum = require("./subforum")
//-----------------------------------
// MF configurations
//-----------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());

//-----------------------------------
// endpoints
//-----------------------------------

//default endpoint
app.get('/', (req, res) => {
    console.log("GET > '/' > Qlassroom Active");

    res.status(200).send({
        "Result": "GET > '/' > Qlassroom Active"
        });
    res.end();
});

app.use('/subforum', subforum)

//-----------------------------------
// exports
//-----------------------------------
module.exports = app;