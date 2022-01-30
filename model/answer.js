var sequelize = require("./sequelize/databaseModel");
const { Response, User, Post } = sequelize.models;

var answer = {
	createAnswer: function (user_id, post_id, answer, callback) {
		Response.create({
			fk_user_id: user_id,
			fk_post_id: post_id,
			answer: answer,
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAnswersForPost: function (post_id, callback) {
		Response.findAll({
			attributes: ["answer_id", "answer", "answer_created_at"],
			where: { fk_post_id: post_id },
			include: [{
				model: User,
				attributes: ["user_id", "first_name", "last_name"],
			}]
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllAnswersByUser: function (user_id, callback) {
		Response.findAll({
			where: { 
				fk_user_id: user_id,
				fk_response_type_id: "fab3d89f-553d-4c37-a55e-3cc15b3747c9"
			},
			include: [
				{
					model: User
				},
				{
					model: Post
				}
			]
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
};

module.exports = answer;