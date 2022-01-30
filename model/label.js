var sequelize = require("./sequelize/databaseModel");
const { Label } =  sequelize.models;

var label = { 
	getAllLabels: function (callback) {
		Label.findAll({
			attributes: ["label_id", "label_name", "editable", "fk_subforum_id", "fk_grade_id", "created_at", "parent_label_id"],
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},

	getSubforumGradeLabels: function (fk_subforum_id, fk_grade_id, callback) {
		Label.findAll({
			attributes: ["label_id", "label_name", "editable", "fk_subforum_id", "fk_grade_id", "created_at", "parent_label_id"],
			where: {
				fk_subforum_id,
				fk_grade_id
			},
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},

	addLabel: function (label_id, label_name, editable, fk_subforum_id, fk_grade_id, created_at, parent_label_id, callback) {
		Label.create({
			label_id,
			label_name,
			editable,
			fk_subforum_id,
			fk_grade_id,
			created_at,
			parent_label_id
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
};

module.exports = label;