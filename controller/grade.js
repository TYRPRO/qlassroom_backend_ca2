const express = require("express");

const router = express.Router();
const grade = require("../model/grade");
const printDebugInfo = require("./middleware/printDebugInfo");


router.get("/", printDebugInfo, (req, res) => {

	grade.getGrades((err, result) => {
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