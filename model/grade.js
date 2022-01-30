var sequelize = require("./sequelize/databaseModel");
const { Grade } =  sequelize.models;

var grade = { 
	getGrades: function (callback) {
		Grade.findAll({
			attributes: ["grade_id", "grade_name"],
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
};

module.exports = grade;