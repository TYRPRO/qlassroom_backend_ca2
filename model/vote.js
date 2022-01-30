/* eslint-disable no-unused-vars */
var sequelize = require("./sequelize/databaseModel.js");
const { PostVote, ResponseVote, Post, Subforum } = sequelize.models;

var vote = {
	createPostVote: function (vote_type, fk_post_id, fk_user_id, callback) {
		PostVote.create({
			vote_type: vote_type,
			fk_post_id: fk_post_id,
			fk_user_id: fk_user_id
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves all the votes for *all* posts.  
	getPostVotes: function (fk_post_id, callback) {
		PostVote.findAll({
			where: {
				fk_post_id: fk_post_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves users votes for a specific post
	getUserPostVotes: function (fk_user_id, fk_post_id, callback) {
		PostVote.findAll({
			where: {
				fk_post_id: fk_post_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves users votes for a specific Subforum
	getUserSubforumPostVotes: function (fk_user_id, fk_Subforum_id, callback) {
		PostVote.findAll({
			where: {
				fk_user_id: fk_user_id
			},
			include: [{
				model: Post,
				include: [{
					model: Subforum,
					where: {
						Subforum_id: fk_Subforum_id
					}
				}]
			}]
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			console.log(err);
			callback(null, err);
		});
	},
	updatePostVote: function (vote_type, fk_post_id, fk_user_id, callback) {
		PostVote.update({
			vote_type: vote_type
		}, {
			where: {
				fk_post_id: fk_post_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	deletePostVote: function (fk_post_id, fk_user_id, callback) {
		PostVote.destroy({
			where: {
				fk_post_id: fk_post_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	getUserVotes: function (fk_user_id, callback) {
		PostVote.findAll({
			where: {
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	getUpvotesGiven: function (user_id, callback) {
		PostVote.findAll({
			where: {
				vote_type: true,
				fk_user_id: user_id
			}
		}).then(function (result1) {
			ResponseVote.findAll({
				where: {
					vote_type: true,
					fk_user_id: user_id
				}
			}).then(function (result2) {
				var result = {
					post_votes: result1,
					response_votes: result2
				};
				return callback(result, null);
			}).catch(function (err) {
				return callback(null, err);
			});
		}).catch(function (err) {
			return callback(null, err);
		});
	},

	// Create Response Vote
	createResponseVote: function (vote_type, fk_response_id, fk_user_id, callback) {
		ResponseVote.create({
			vote_type: vote_type,
			fk_response_id: fk_response_id,
			fk_user_id: fk_user_id
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves users response votes for a specific post
	getUserPostResponseVotes: function (fk_user_id, fk_post_id, callback) {
		ResponseVote.findAll({
			where: {
				fk_user_id: fk_user_id
			},
			include: [{
				model: Response,
				include: [{
					model: Post,
					where: {
						post_id: fk_post_id
					}
				}]
			}]
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves users votes for a specific response
	getUserResponseVotes: function (fk_user_id, fk_response_id, callback) {
		ResponseVote.findAll({
			where: {
				fk_response_id: fk_response_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) { 
			callback(null, err);
		});
	},
	// Updates user's upvote or downvote on a response
	updateResponseVote: function (vote_type, fk_response_id, fk_user_id, callback) {
		ResponseVote.update({
			vote_type: vote_type
		}, {
			where: {
				fk_response_id: fk_response_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result , null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Removes a user's upvote or downvote on a response
	deleteResponseVote: function (fk_response_id, fk_user_id, callback) {
		ResponseVote.destroy({
			where: {
				fk_response_id: fk_response_id,
				fk_user_id: fk_user_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
	// Retrieves all the votes for 1 response.  
	getResponseVotes: function (fk_response_id, callback) {
		ResponseVote.findAll({
			where: {
				fk_response_id: fk_response_id
			}
		}).then(function (result) {
			callback(result, null);
		}).catch(function (err) {
			callback(null, err);
		});
	},
};

module.exports = vote;