/* eslint-disable no-unused-vars */
const express = require("express");

const router = express.Router();
const label = require("../model/label");
const printDebugInfo = require("./middleware/printDebugInfo");


router.get("/all", printDebugInfo, (req, res) => {

	label.getAllLabels((err, result) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/:fk_subforum_id/:fk_grade_id", printDebugInfo, (req, res) => {
	const { fk_subforum_id, fk_grade_id } = req.params;

	try {
		if (typeof fk_subforum_id == "undefined" || fk_subforum_id == null || fk_subforum_id.trim().length == 0) {
			res.status(400).send({ "Error": "Subforum ID is empty." });
		}
		else if (typeof fk_grade_id == "undefined" || fk_subforum_id == null || fk_subforum_id.trim().length == 0) {
			res.status(400).send({ "Error": "Grade ID is empty." });
		}
		else {
			label.getSubforumGradeLabels(fk_subforum_id, fk_grade_id, (err, result) => {
				if (err) {
					console.log(err);
					res.status(500).send(err);
				}
				else {
					res.status(200).send(result);
				}
			});
		}
	} catch (error) {
		res.status(500).send(error);
	}



});

router.post("/", printDebugInfo, (req, res) => {
	const { label_data, fk_subforum_id, fk_grade_id } = req.body;
	const label_array = label_data.topics;
	const errored = false;
	let errorCause = "";


	for (let i = 0; i < label_array.length; i++) {
		let current_label = label_array[i];

		let label_id = current_label.dimension_id;
		let label_name_arr = current_label.dimension_name.split(" ");
		let label_name = "";
		if (label_name_arr.length === 1) {
			label_name = label_name_arr[0];
		}
		else {
			for (let j = 1; j < label_name_arr.length; j++) {
				label_name += label_name_arr[j];
				if (j < label_name_arr.length - 1) {
					label_name += " ";
				}
			}
		}
		let editable = current_label.editable;
		let created_at = current_label.createdAt;
		let parent_label_id = current_label.DimensionDimensionId;
		label.addLabel(label_id, label_name, editable, fk_subforum_id, fk_grade_id, created_at, parent_label_id, (err, result) => {
			if (err) {
				console.log(err);
				errorCause = err;
				console.log("_______________________________________________________________");
				console.log("Current Data: ");
				console.log("i: " + i);
				console.log("label_id: " + label_id);
				console.log("label_name: " + label_name);
				console.log("parent_label_id: " + parent_label_id);
				console.log("Current Data: ");
				console.log("_______________________________________________________________");

			}
		});
	}

	if (errored) {
		res.status(500).send(errorCause);
	}
	else {
		res.status(201).send({ success: "true" });
	}

});


module.exports = router;