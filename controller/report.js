const express = require("express");
const router = express.Router();
const report = require("../model/report.js");

const printDebugInfo = require("./middleware/printDebugInfo");

//addReport
router.post("/report", printDebugInfo, function (req, res) {
	var report_content = req.body.report_content;
	var fk_post_id = req.body.fk_post_id;
	var fk_response_id = req.body.fk_response_id;
	var fk_user_id = req.body.fk_user_id;

	report.createReport(report_content, fk_post_id, fk_response_id, fk_user_id, function (err, result) {
		if (!err) {
			res.status(201).send({ "Result": result });
		}
		else {
			res.status(500).send({ "message": "Error creating report." });
		}
	});

});

//getallreports
router.get("/report", printDebugInfo, function (req, res) {

	report.getAll(function (err, result) {
		if (!err) {
			res.status(200).send({ "Result": result });
		} else {
			res.status(500).send({ "message": "Error getting reports" });
		}
	});

});

//getonereport
router.get("/report/:id", printDebugInfo, function (req, res) {
	var report_id = req.params.id;

	report.getReport(report_id, function (err, result) {
		if (!err) {
			res.status(200).send({ "Result": result });
		} else {
			res.status(500).send({ "message": "Error fetching requested report." });
		}
	});

});

//getallreportsinsubforum
router.get("/reports/:subforum_id", printDebugInfo, function (req, res) {
	var subforum_id = req.params.subforum_id;

	report.getAllBysubforum(subforum_id, function (err, result) {
		if (!err) {
			res.status(200).send({ "Result": result });
		} else {
			res.status(500).send({ "message": "Error fetching reports in subforum." });
		}
	});

});

//delete report
router.delete("/report/:id", printDebugInfo, function (req, res) {
	var report_id = req.params.id;

	report.delete(report_id, function (err, result) {
		if (!err) {
			res.status(204).send({ "Result": result });
		} else {
			res.status(500).send({ "message": "Error deleting report." });
		}
	});

});

module.exports = router;