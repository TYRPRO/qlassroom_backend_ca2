console.log("---------------------------------");
console.log(" Qlassroom > model > subforum.js");
console.log("---------------------------------");

// Imports
var sequelize = require("./sequelize/databaseModel.js");
const { Subforum } = sequelize.models;
// const { Op } = require("sequelize");

const subforum = {
	createSubforum: function (fk_user_id, subforum_name, subforum_description, callback) {
		Subforum.findOne({ where: { subforum_name } }).then(function (result) {
			if (result == null) {
				Subforum.create({
					subforum_description,
					subforum_name,
					fk_user_id,
				})
					.then(function (result) {
						return callback(null, result);
					})
					.catch(function (err) {
						console.log("Error: " + err);
						return callback(err, null);
					});
			} else {
				return callback("duplicate", null);
			}
		});
	},
	checkIsOwner: function (fk_user_id, subforum_id, callback) {
		Subforum.findOne({ where: { subforum_id, fk_user_id } }).then(function (result) {
			if (result != null) {
				result = true;
				return callback(null, result);
			} else {
				return callback("duplicate", null);
			}
		});
	},
	// Function to get Subjects/Subforum for landing page Channel
	getSubjects: function (callback) {
		Subforum.findAll({
			attributes: ["subforum_id", "subforum_name"],
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
};

module.exports = subforum;
