var sequelize = require("./sequelize/databaseModel.js");
const { Report, User, Post, Subforum } = sequelize.models;

const { Op } = require("sequelize");

var report = {
	createReport: function (report_content, fk_post_id, fk_response_id, fk_user_id, callback) {
		Report.create({
			report_content: report_content,
			fk_post_id: fk_post_id,
			fk_response_id: fk_response_id,
			fk_user_id: fk_user_id
		}).then(function (result) {
			console.log("Result: " + JSON.stringify(result));
			return callback(null, result);
		});
	},

	getReport: function (report_id, callback) {
		Report.findByPk(report_id, {
			attributes: ["report_id", "report_content", "fk_post_id", "fk_response_id", "fk_user_id", "created_at"],
			include: [
				{
					model: User,
					attributes: ["first_name", "last_name"]
				},
			],
		}).then(function (result) {
			console.log(result);

			callback(null, result);
		}).catch(function (err) {
			console.log(err);
			callback(err, null);
		});
	},

	getAll: function (callback) {
		// find multiple entries
		Report.findAll({
			attributes: ["report_id", "report_content", "fk_post_id", "fk_response_id", "fk_user_id", "created_at"],
			include: [
				{
					model: User,
					attributes: ["first_name", "last_name"]
				},
			],
		}).then(function (result) {
			console.log(result);

			callback(null, result);
		}).catch(function (err) {
			console.log(err);
			callback(err, null);
		});
	},

	getAllBysubforum: function (subforum_id, callback) {
		// find multiple entries
		Report.findAll({
			attributes: ["report_id", "report_content", "fk_post_id", "fk_response_id", "fk_user_id", "created_at"],
			include: [
				{
					model: User,
					attributes: ["first_name", "last_name"]
				},
				{
					model: Post,
					where: {
						fk_subforum_id: subforum_id
					},

				}
			],
		}).then(function (result) {
			console.log(result);

			callback(null, result);
		}).catch(function (err) {
			console.log(err);
			callback(err, null);
		});
	},

	delete: function (report_id, callback) {
		Report.destroy({
			where: { report_id: report_id }
		}).then(function (result) {
			return callback(null, result);
		});
	},
};

module.exports = report;
