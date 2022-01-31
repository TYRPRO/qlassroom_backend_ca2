//Qlassroom Forums

//-----------------------------------
// imports
//-----------------------------------

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const post = require("./post");
const answer = require("./answer");
const responses = require("./response");
const grade = require("./grade");
const user = require("./user.js");
const subforum = require("./subforum");
const label = require("./label");
const vote = require("./vote");
const report = require("./report");
const chat = require("./chat");

//-----------------------------------
// Middleware functions
//-----------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var cors = require("cors");

//-----------------------------------
// MF configurations
//-----------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

app.options("*", cors());
app.use(cors());

//-----------------------------------
// endpoints
//-----------------------------------

//default endpoint
app.get("/", (req, res) => {
	console.log("GET > " / " > Qlassroom Active");
	res.status(200).send({
		"Result": "GET > " / " > Qlassroom Active"
	});
	res.end();
});

app.use("/posts", post);
app.use("/answers", answer);
app.use("/grade", grade);
app.use("/subforum", subforum);
app.use("/user", user);
app.use("/responses", responses);
app.use("/label", label);
app.use("/vote", vote);
app.use("/chat", chat);
app.use("/report", report);

//-----------------------------------
// exports
//-----------------------------------
module.exports = app;