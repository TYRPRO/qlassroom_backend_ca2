const express = require("express");

const router = express.Router();
const answer = require("../model/answer");
const printDebugInfo = require("./middleware/printDebugInfo");

router.post("/", printDebugInfo, (req, res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;
	var user_answer = req.body.answer;
    
	answer.createAnswer(user_id, post_id, user_answer, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
			console.log(result);
		}
	});
});

router.get("/posts/:post_id", printDebugInfo, (req, res) => {
	var post_id = req.params.post_id;

	answer.getAnswersForPost(post_id, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/user/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;

	answer.getAllAnswersByUser(user_id, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

module.exports = router;