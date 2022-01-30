/* eslint-disable no-unused-vars */
var sequelize = require("./sequelize/databaseModel");
const { Response, ResponseType, ResponseVote, Post, User } = sequelize.models;

var response = {
	createResponse: function (response, parent_response_id, response_type, post_id, user_id, callback) {
		ResponseType.findAll()
			.then(function (result) {
				var response_type_id = null;
				for (var i = 0; i < result.length; i++) {
					if (response_type === result[i].response_type) {
						response_type_id = result[i].response_type_id;
						break;
					}
				}

				if (response_type_id === null) {
					return callback("Response Type ID is null", null);
				}

				if (response_type === "answer") {
					Post.increment("post_answers_count", { by: 1, where: { post_id: post_id } });
				}

				Response.create({
					response: response,
					parent_response_id: parent_response_id,
					fk_response_type_id: response_type_id,
					fk_post_id: post_id,
					fk_user_id: user_id,
				}).then(function (result) {
					Post.increment("post_answers_count", {
						by: 1,
						where: {
							post_id: post_id
						}
					}).then(function (result) {
						return callback(null, result);
					}).catch(function (err) {
						return callback(err, null);
					});
				}).catch(function (err) {
					return callback(err, null);
				});
			}).catch(function (err) {
				return callback(err, null);
			});
	},
	getResponses: function (post_id, callback) {
		Response.findAll({
			where: { fk_post_id: post_id },
			include: [{
				model: ResponseType,
			},
			{
				model: ResponseVote,

			},
			{
				model: User,
			}]
		}).then(function (result) {
			// Formats the response votes.
			console.log(result);
			for (let i = 0; i < result.length; i++) {
				let response = result[i];
				let response_votes = response.ResponseVotes;
				let response_votes_count = 0;
				for (let x = 0; x < response_votes.length; x++) {
					if(response_votes[x].vote_type == true) {
						response_votes_count += 1;
					}
					else {
						response_votes_count -= 1;
					}
				}

				result[i].dataValues.response_votes_count = response_votes_count;
				
			}
			console.log(result);

			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getUpdatesReceived: function (user_id, callback) {
		Response.findAll({
			include: [{
				model: Post,
				where: { fk_user_id: user_id }
			}]
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAnswersAccepted: function (user_id, callback) {
		Post.findAll({
			where: {
				post_is_answered: true,
			},
			include: [{
				model: Response,
				where: {
					fk_user_id: user_id
				}
			}]
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
};

module.exports = response;