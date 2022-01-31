const express = require("express");

const router = express.Router();
const response = require("../model/response");
const printDebugInfo = require("./middleware/printDebugInfo");
const verify = require("./middleware/verify");

router.post("/", printDebugInfo, verify.verifySameUserId, (req, res) => {
	var response_value = req.body.response;
	var parent_response_id = req.body.parent_response_id;
	var response_type = req.body.response_type;
	var post_id = req.body.post_id;
	var user_id = req.body.user_id;

	if (response_value == null || post_id == null || user_id == null) {
		res.status(400).send({ "err": "Essential Information Missing" });
	}
	else {
		response.createResponse(response_value, parent_response_id, response_type, post_id, user_id, (err, result) => {
			if (err) {
				if (err.name == "SequelizeValidationError") {
					res.status(400).send({ "err": "Response Information is either missing or invalid" });
				}
				else {
					res.status(500).send({ "err": "Unexpected Error Occured"});
				}

			}
			else {
				res.status(200).send(result);
			}
		});
	}


});

router.get("/:post_id", printDebugInfo, (req, res) => {
	var post_id = req.params.post_id;

	response.getResponses(post_id, (err, result) => {
		if (err) {
			if (err.original.code == "22P02") {
				res.status(400).send({ "error": "Invalid Post ID" });
			}
			else {
				res.status(500).send({ "error": "Unexpected Error Occured" });
			}
		}
		else {
			if (result == null) {
				res.status(400).send({ "error": "Response not found" });
			}
			else {
				res.status(200).send(result);
			}

		}
	});
});

// Get Number of Updates
router.get("/user/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;

	response.getUpdatesReceived(user_id, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			if (result.length === 0) {
				res.status(404).send("No Updates found");
			} else {
				res.status(200).send(result);
			}
		}
	});
});

// Get Number of Accepted Answers
router.get("/answersaccepted/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;

	response.getAnswersAccepted(user_id, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			if (result.length === 0) {
				res.status(404).send("No Accepted Answer found");
			} else {
				res.status(200).send(result);
			}
		}
	});
});



module.exports = router;