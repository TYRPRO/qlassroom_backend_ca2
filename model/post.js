/* eslint-disable no-unused-vars */
var sequelize = require("./sequelize/databaseModel");

const { Post, Subforum, SavedPost, User, Grade, PostLabel, Label, Response, ResponseType, UserProfile } = sequelize.models;
const { Op, where } = require("sequelize");

var post = {
	createPost: function (user_id, subforum_id, title, content, grade, tags, callback) {
		console.log(grade);
		Post.create({
			post_title: title,
			post_content: content,
			fk_user_id: user_id,
			fk_subforum_id: subforum_id,
			fk_grade_id: grade
		}).then(function (result) {
			if (tags.length == 0) {
				return callback(null, result);
			}
			else {
				let previousResult = result;
				let post_id = result.post_id;
				let tempArr = [];
				for (let i = 0; i < tags.length; i++) {
					tempArr.push({ "fk_post_id": post_id, "fk_label_id": tags[i].label_id });
				}
				PostLabel.bulkCreate(tempArr).then(() => {
					return callback(null, previousResult);
				}).catch((err) => {
					return callback(err, null);
				});
			}

		}).catch(function (err) {
			console.log(err);
			return callback(err, null);
		});
	},
	getPost: function (post_id, callback) {
		Post.findOne({
			attributes: ["post_id", "post_title", "fk_user_id", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "fk_grade_id", "post_answers_count", "fk_response_id"],
			where: { post_id: post_id },
			include: [{
				model: User,
				required: true,
				attributes: ["first_name", "last_name"],
				include: [{
					model: UserProfile
				}]
			},
			{
				model: PostLabel,
				attributes: ["fk_label_id", "fk_post_id"],
				include: [{
					model: Label,
					required: true,
					attributes: ["label_name", "label_id"],
				}]
			},
			{
				model: SavedPost,
			},
			{
				model: Grade,
			},
			{
				model: Subforum,
			},]

			// add include once user and subforums are made
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	updatePost: function (post_id, title, content, user_id, subforum_id, grade_id, tags, callback) {
		console.log(post_id);
		Post.update({
			post_title: title,
			post_content: content,
			fk_user_id: user_id,
			fk_subforum_id: subforum_id,
			fk_grade_id: grade_id
		}, {
			where: { post_id: post_id }
		}).then(function (result) {

			console.log("here");
			if (tags.length == 0) {
				return callback(null, result);
			}
			else {

				let previousResult = result;
				let tempArr = [];
				for (let i = 0; i < tags.length; i++) {
					tempArr.push({ "fk_post_id": post_id, "fk_label_id": tags[i].label_id });
				}

				PostLabel.destroy({
					where: { fk_post_id: post_id }
				}).then(() => {
					PostLabel.bulkCreate(tempArr).then(() => {
						return callback(null, previousResult);
					}).catch((err) => {
						return callback(err, null);
					});
				}).catch((err) => {
					return callback(err, null);
				});
			}

		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllSubforumPosts: function (fk_subforum_id, callback) {
		Post.findAll({
			attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			where: { fk_subforum_id },
			include: [{
				model: User,
				attributes: ["user_id", "first_name", "last_name"]
			},
			{
				model: Grade,
				attributes: ["grade_id", "grade_name"]
			},
			{
				model: Subforum,
				attributes: ["subforum_id", "subforum_name"]
			},
			{
				model: PostLabel,
				attributes: [["fk_label_id", "fk_post_id"]],
				include: [{
					model: Label,
					required: true,
					attributes: [["label_name", "label_name"]],
				}]
			},
			{
				model: Response,
				include: [{
					model: ResponseType,
					where: { response_type: "answer" }
				}],
			}]

			// add include once user and subforums are made
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllPosts: function (callback) {
		// find multiple entries
		Post.findAll({
			attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			include: [
				{
					model: User,
					attributes: ["user_id", "first_name", "last_name"]
				},
				{
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				},
				{
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}
			],
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllPostByUser: function (user_id, callback) {
		Post.findAll({
			include: [
				{
					model: User,
					attributes: ["user_id", "first_name", "last_name"],
					where: { user_id: user_id },
				},
				{
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"],
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
					}]
				}
			],
			order: [["post_created_at", "DESC"]]

			// add include once user and subforums are made
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			return callback(err, null);
		});
	},
	getAllSavedPostByUser: function (user_id, callback) {
		SavedPost.findAll({
			where: { fk_user_id: user_id },
			include: [
				{
					model: Post,
					include: [{
						model: Response,
						include: [{
							model: ResponseType,
						}]
					}]
				},
				{
					model: User
				}
			],
			order: [[{ model: Post }, "post_created_at", "DESC"]]

			// add include once user and subforums are made
		}).then(function (result) {
			callback(null, result);
		}).catch(function (err) {
			console.log(err);
			callback(err, null);
		});
	},
	savePost: function (user_id, post_id, callback) {
		SavedPost.create({
			fk_user_id: user_id,
			fk_post_id: post_id
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			console.log(err);
			return callback(err, null);
		});
	},
	removeSavedPost: function (user_id, post_id, callback) {
		SavedPost.destroy({
			where: {
				fk_user_id: user_id,
				fk_post_id: post_id
			}
		}).then(function (result) {
			return callback(null, result);
		}).catch(function (err) {
			console.log(err);
			return callback(err, null);
		});
	},
	getFilteredPost: function (subforum_id, grade_id, isanswered, callback) {
		switch (true) {
		// If user only selects unanswered questions  -- N Subforum, grades | Y unanswered 
		case subforum_id == null && isanswered != null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes: ["user_id", "first_name"],
				}, {
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				}, {
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}],
				where: {
					fk_subforum_id: { [Op.not]: subforum_id },
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: isanswered
				}
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user unselects subject, give all post results --  N Subforum, grades, unanswered 
		case subforum_id == null && isanswered == null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes: ["user_id", "first_name"],
				}, {
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				}, {
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}],
				where: {
					fk_subforum_id: { [Op.not]: subforum_id },
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: { [Op.not]: isanswered }
				}
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user only selects a subject and nothing else -- Y Subforum | N Grades, unanswered 
		case grade_id == null && isanswered == null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes: ["user_id", "first_name"],
				}, {
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				}, {
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}],
				where: {
					fk_subforum_id: subforum_id,
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: { [Op.not]: isanswered }
				}
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If User only selects subjects that is unanswered -- Y Subforum | N Grades | Y unanswered
		case grade_id == null && isanswered != null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes: ["user_id", "first_name"],
				}, {
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				}, {
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}],
				where: {
					fk_subforum_id: subforum_id,
					fk_grade_id: { [Op.not]: grade_id },
					post_is_answered: isanswered
				},

			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user selects a subject with grades that is either answered or answered -- Y Subforum, Grades | N answered
		case grade_id != null && isanswered == null:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes: ["user_id", "first_name"],
				}, {
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				}, {
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}],
				where: {
					fk_subforum_id: subforum_id,
					fk_grade_id: grade_id,
					post_is_answered: { [Op.not]: isanswered }
				}

			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
			// If user selects a subject, grade and unanswered questions -- Y Subforum, grades, unanswered
		default:
			Post.findAll({
				attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
				include: [{
					model: User,
					attributes: ["user_id", "first_name"],
				}, {
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				}, {
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				},
				{
					model: Response,
					include: [{
						model: ResponseType,
						where: { response_type: "answer" }
					}],
				}],
				where: { fk_subforum_id: subforum_id, fk_grade_id: grade_id, post_is_answered: isanswered },
			}).then(function (result) {
				return callback(null, result);
			}).catch(function (err) {
				return callback(err, null);
			});
			break;
		}
	},
	setCorrectAnswer: function (post_id, answer_id, user_id, callback) {
		Post.update(
			{
				post_is_answered: true,
				fk_response_id: answer_id

			},
			{
				where: {
					post_id: post_id,
					fk_user_id: user_id
				}

				// add include once user and subforums are made
			})
			.then(function (result) {
				return callback(null, result);
			})
			.catch(function (err) {
				return callback(err, null);
			});
	},
	searchPost: function (post_title, callback) {
		Post.findAll({
			where: { post_title: { [Op.like]: "%" + post_title + "%" } },
			attributes: ["post_id", "fk_subforum_id", "fk_user_id", "fk_grade_id", "post_title", "post_content", "post_is_pinned", "post_is_answered", "post_created_at", "post_rating", "post_answers_count", "fk_response_id"],
			include: [
				{
					model: User,
					attributes: ["user_id", "first_name", "last_name"]
				},
				{
					model: Grade,
					attributes: ["grade_id", "grade_name"]
				},
				{
					model: Subforum,
					attributes: ["subforum_id", "subforum_name"]
				},
				{
					model: PostLabel,
					attributes: [["fk_label_id", "fk_post_id"]],
					include: [{
						model: Label,
						required: true,
						attributes: [["label_name", "label_name"]],
					}]
				}
			],
		}).then(function (result) {
			callback(null, result);
		}).catch(function (err) {
			console.log(err);
			callback(err, null);
		});
	},
};

module.exports = post;